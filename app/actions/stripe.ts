"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function createInvoiceCheckoutSession(invoiceId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be signed in to pay an invoice.")
  }

  // Look up the invoice server-side and scope it to the logged-in user.
  // Never trust an amount sent from the client.
  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("id, amount, status, description, user_id")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single()

  if (error || !invoice) {
    throw new Error("Invoice not found.")
  }

  if (invoice.status === "paid") {
    throw new Error("This invoice has already been paid.")
  }

  const amountInCents = Math.round(Number(invoice.amount) * 100)
  if (!amountInCents || amountInCents < 50) {
    throw new Error("Invalid invoice amount.")
  }

  const headersList = await headers()
  const origin = headersList.get("origin") || "https://horizonoperations.cleaning"

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: invoice.description || "Cleaning Service",
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      invoice_id: invoice.id,
      user_id: user.id,
    },
    customer_email: user.email,
    return_url: `${origin}/portal/invoices?payment=complete&session_id={CHECKOUT_SESSION_ID}`,
  })

  // Track the session on the invoice so the webhook can reconcile it.
  await supabase
    .from("invoices")
    .update({ stripe_session_id: session.id })
    .eq("id", invoice.id)

  return session.client_secret
}
