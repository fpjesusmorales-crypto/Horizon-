"use server"

import { createClient } from "@/lib/supabase/server"
import { generateRecurringBookings } from "@/lib/recurring"

// Manually trigger recurring booking generation from the admin dashboard.
// Only admins and dispatchers may run this.
export async function runRecurringGeneration() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: employee } = await supabase
    .from("employees")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher"].includes(employee.role)) {
    return { error: "Not authorized" }
  }

  const result = await generateRecurringBookings(7)
  return { result }
}
