import "server-only"
import Stripe from "stripe"

// Lazily instantiate the Stripe client so the module can be imported during
// build/page-data collection without requiring STRIPE_SECRET_KEY at that time.
let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return stripeClient
}

// Proxy forwards property access to the real client, constructing it on first use.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === "function" ? value.bind(client) : value
  },
})
