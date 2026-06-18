"use server"

import { createClient } from "@/lib/supabase/server"
import { generateRecurringBookings, syncBookingsToWorkOrders } from "@/lib/recurring"
import { revalidatePath } from "next/cache"

async function requireDispatcher() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" as const }

  const { data: employee } = await supabase
    .from("employees")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher"].includes(employee.role)) {
    return { error: "Not authorized" as const }
  }
  return { ok: true as const }
}

// Manually trigger recurring booking generation from the admin dashboard.
// Only admins and dispatchers may run this.
export async function runRecurringGeneration() {
  const auth = await requireDispatcher()
  if ("error" in auth) return auth

  const result = await generateRecurringBookings(7)
  revalidatePath("/ops/admin")
  revalidatePath("/ops/admin/work-orders")
  return { result }
}

// Pull every existing booking that lacks a work order into the dispatch queue.
export async function syncBookingPipeline() {
  const auth = await requireDispatcher()
  if ("error" in auth) return auth

  const result = await syncBookingsToWorkOrders()
  revalidatePath("/ops/admin")
  revalidatePath("/ops/admin/work-orders")
  return { result }
}
