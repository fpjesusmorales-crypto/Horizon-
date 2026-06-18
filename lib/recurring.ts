import { createClient } from "@supabase/supabase-js"

// Server-side admin client (bypasses RLS for automated/system operations).
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Advance a date string (YYYY-MM-DD) by the given frequency.
function advanceDate(dateStr: string, frequency: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7)
      break
    case "biweekly":
      date.setDate(date.getDate() + 14)
      break
    case "monthly":
      date.setMonth(date.getMonth() + 1)
      break
    default:
      // Default to monthly if frequency is unknown.
      date.setMonth(date.getMonth() + 1)
  }
  return date.toISOString().split("T")[0]
}

type ProfileLite = {
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  zip: string | null
}

// Build the customer-facing fields for a work order from a user's profile.
async function getProfileFields(
  supabase: ReturnType<typeof getAdminClient>,
  userId: string | null,
): Promise<ProfileLite | null> {
  if (!userId) return null
  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, phone, address, city, zip")
    .eq("id", userId)
    .single()
  return (data as ProfileLite) ?? null
}

// Create a work order for a booking if one does not already exist (idempotent on booking_id).
export async function convertBookingToWorkOrder(bookingId: string): Promise<"created" | "skipped"> {
  const supabase = getAdminClient()

  // Already linked? Skip.
  const { data: existing } = await supabase
    .from("work_orders")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle()

  if (existing) return "skipped"

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, user_id, service_type, scheduled_date, scheduled_time, home_size, price, notes, add_ons")
    .eq("id", bookingId)
    .single()

  if (!booking) return "skipped"

  const profile = await getProfileFields(supabase, booking.user_id)
  const customerName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() || null
    : null

  const noteParts = [
    booking.home_size ? `Home size: ${booking.home_size}` : null,
    booking.add_ons && booking.add_ons.length ? `Add-ons: ${booking.add_ons.join(", ")}` : null,
    booking.notes || null,
  ].filter(Boolean)

  const { error } = await supabase.from("work_orders").insert({
    booking_id: booking.id,
    customer_name: customerName,
    customer_email: profile?.email ?? null,
    customer_phone: profile?.phone ?? null,
    address: profile?.address ?? "Address pending",
    city: profile?.city ?? null,
    zip: profile?.zip ?? null,
    service_type: booking.service_type,
    scheduled_date: booking.scheduled_date,
    scheduled_time: booking.scheduled_time,
    price: booking.price ?? null,
    status: "pending",
    notes: noteParts.join("\n") || null,
  })

  if (error) {
    console.log("[v0] convertBookingToWorkOrder error:", error.message)
    return "skipped"
  }
  return "created"
}

// Backfill: create work orders for every booking that does not yet have one.
export async function syncBookingsToWorkOrders(): Promise<{ created: number; skipped: number }> {
  const supabase = getAdminClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id")
    .neq("status", "cancelled")

  let created = 0
  let skipped = 0

  for (const booking of bookings ?? []) {
    const result = await convertBookingToWorkOrder(booking.id)
    if (result === "created") created++
    else skipped++
  }

  return { created, skipped }
}

// Find due recurring services, create a booking for each, advance their next_service_date,
// and create matching work orders.
export async function generateRecurringBookings(
  daysAhead = 7,
): Promise<{ bookingsCreated: number; workOrdersCreated: number }> {
  const supabase = getAdminClient()

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + daysAhead)
  const cutoffStr = cutoff.toISOString().split("T")[0]

  const { data: dueServices } = await supabase
    .from("recurring_services")
    .select("id, user_id, service_type, add_ons, home_size, preferred_time, frequency, next_service_date, status")
    .eq("status", "active")
    .lte("next_service_date", cutoffStr)

  let bookingsCreated = 0
  let workOrdersCreated = 0

  for (const service of dueServices ?? []) {
    // Create the booking for the due date.
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: service.user_id,
        service_type: service.service_type,
        add_ons: service.add_ons ?? [],
        home_size: service.home_size,
        scheduled_date: service.next_service_date,
        scheduled_time: service.preferred_time,
        status: "scheduled",
        notes: "Auto-generated from recurring service",
      })
      .select("id")
      .single()

    if (bookingError || !booking) {
      console.log("[v0] generateRecurringBookings booking error:", bookingError?.message)
      continue
    }
    bookingsCreated++

    // Create the matching work order.
    const result = await convertBookingToWorkOrder(booking.id)
    if (result === "created") workOrdersCreated++

    // Advance the recurring schedule.
    await supabase
      .from("recurring_services")
      .update({
        next_service_date: advanceDate(service.next_service_date, service.frequency),
        updated_at: new Date().toISOString(),
      })
      .eq("id", service.id)
  }

  return { bookingsCreated, workOrdersCreated }
}
