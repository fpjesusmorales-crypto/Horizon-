"use server"

import { createClient } from "@/lib/supabase/server"
import { geocodeAddress, formatWorkOrderAddress } from "@/lib/geocode"
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
  return { ok: true as const, supabase }
}

/**
 * Geocode all work orders that have an address but no coordinates yet.
 * Returns how many were updated. Admin/dispatcher only.
 */
export async function backfillJobCoordinates() {
  const auth = await requireDispatcher()
  if ("error" in auth) return auth
  const { supabase } = auth

  const { data: orders, error } = await supabase
    .from("work_orders")
    .select("id, address, city, zip, latitude, longitude")
    .or("latitude.is.null,longitude.is.null")

  if (error) return { error: error.message }
  if (!orders?.length) return { updated: 0, failed: 0 }

  let updated = 0
  let failed = 0

  for (const order of orders) {
    const address = formatWorkOrderAddress(order)
    if (!address) {
      failed++
      continue
    }

    const coords = await geocodeAddress(address)
    if (!coords) {
      failed++
      continue
    }

    const { error: updateError } = await supabase
      .from("work_orders")
      .update({ latitude: coords.lat, longitude: coords.lng })
      .eq("id", order.id)

    if (updateError) {
      failed++
    } else {
      updated++
    }
  }

  revalidatePath("/ops/admin/map")
  return { updated, failed }
}

/**
 * Geocode a single work order on demand (e.g. right after creation).
 */
export async function geocodeWorkOrder(workOrderId: string) {
  const auth = await requireDispatcher()
  if ("error" in auth) return auth
  const { supabase } = auth

  const { data: order, error } = await supabase
    .from("work_orders")
    .select("id, address, city, zip")
    .eq("id", workOrderId)
    .single()

  if (error || !order) return { error: error?.message ?? "Work order not found" }

  const coords = await geocodeAddress(formatWorkOrderAddress(order))
  if (!coords) return { error: "Could not geocode this address" }

  const { error: updateError } = await supabase
    .from("work_orders")
    .update({ latitude: coords.lat, longitude: coords.lng })
    .eq("id", workOrderId)

  if (updateError) return { error: updateError.message }

  revalidatePath("/ops/admin/map")
  return { lat: coords.lat, lng: coords.lng }
}

/**
 * Employee updates their own live location. Called periodically from the
 * employee portal while location sharing is enabled.
 */
export async function updateMyLocation(lat: number, lng: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("employees")
    .update({
      current_latitude: lat,
      current_longitude: lng,
      location_updated_at: new Date().toISOString(),
      location_sharing: true,
    })
    .eq("user_id", user.id)

  if (error) return { error: error.message }
  return { ok: true }
}

/**
 * Employee toggles location sharing on/off. When turning off, we clear the
 * sharing flag (coordinates are kept as last-known but won't update).
 */
export async function setLocationSharing(enabled: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("employees")
    .update({ location_sharing: enabled })
    .eq("user_id", user.id)

  if (error) return { error: error.message }
  return { ok: true }
}
