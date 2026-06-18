import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

export async function POST(req: Request) {
  // Admin client (service role) so the webhook can update invoices without a user session.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // Fallback for environments without a configured webhook secret.
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    console.error("[v0] Stripe webhook signature error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoice_id

    if (invoiceId) {
      const { error } = await supabaseAdmin
        .from("invoices")
        .update({
          status: "paid",
          paid_date: new Date().toISOString(),
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        })
        .eq("id", invoiceId)

      if (error) {
        console.error("[v0] Failed to mark invoice paid:", error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
