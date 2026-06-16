"use client"

import { useCallback } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { createInvoiceCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function InvoiceCheckout({ invoiceId }: { invoiceId: string }) {
  const fetchClientSecret = useCallback(() => {
    return createInvoiceCheckoutSession(invoiceId).then((secret) => {
      if (!secret) throw new Error("Could not start checkout.")
      return secret
    })
  }, [invoiceId])

  return (
    <div id="checkout" className="overflow-hidden rounded-2xl">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
