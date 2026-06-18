import { NextResponse } from "next/server"
import { generateRecurringBookings, syncBookingsToWorkOrders } from "@/lib/recurring"

export async function GET(request: Request) {
  // Protect the cron endpoint with the Vercel CRON_SECRET when present.
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const recurring = await generateRecurringBookings(7)
  const sync = await syncBookingsToWorkOrders()

  return NextResponse.json({ recurring, sync })
}
