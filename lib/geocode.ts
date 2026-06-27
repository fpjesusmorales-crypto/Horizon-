import "server-only"

type GeocodeResult = { lat: number; lng: number } | null

/**
 * Convert a street address into latitude/longitude using the Google
 * Geocoding API. Runs server-side only so the API key is never exposed.
 * Returns null when the address can't be resolved.
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const key = process.env.GCP_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!key) {
    console.log("[v0] geocodeAddress: missing Google Maps API key")
    return null
  }
  if (!address || !address.trim()) return null

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${key}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== "OK" || !data.results?.length) {
      console.log("[v0] geocodeAddress: no result for", address, "status:", data.status)
      return null
    }

    const loc = data.results[0].geometry.location
    return { lat: loc.lat, lng: loc.lng }
  } catch (err) {
    console.log("[v0] geocodeAddress error:", err instanceof Error ? err.message : String(err))
    return null
  }
}

/** Build a single-line address string from work order fields. */
export function formatWorkOrderAddress(wo: {
  address?: string | null
  city?: string | null
  zip?: string | null
}): string {
  return [wo.address, wo.city, wo.zip].filter(Boolean).join(", ")
}
