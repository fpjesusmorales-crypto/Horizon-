"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, MapPinOff, Loader2 } from "lucide-react"
import { updateMyLocation, setLocationSharing } from "@/app/actions/location"

const UPDATE_INTERVAL_MS = 30000 // push location every 30s

export function LocationSharingToggle({ initialSharing }: { initialSharing: boolean }) {
  const [sharing, setSharing] = useState(initialSharing)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const watchIdRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastCoords = useRef<{ lat: number; lng: number } | null>(null)

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const pushLocation = async () => {
    if (!lastCoords.current) return
    const { lat, lng } = lastCoords.current
    const res = await updateMyLocation(lat, lng)
    if (res?.error) {
      console.log("[v0] updateMyLocation error:", res.error)
      setStatus("Error sharing location")
    } else {
      setStatus(`Location shared at ${new Date().toLocaleTimeString()}`)
    }
  }

  const startTracking = () => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation is not supported on this device")
      return
    }
    // Continuously track the latest position locally.
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        lastCoords.current = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      },
      (err) => {
        console.log("[v0] geolocation error:", err.message)
        setStatus(err.code === err.PERMISSION_DENIED ? "Location permission denied" : "Unable to get location")
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 },
    )
    // Push to the server immediately, then on an interval.
    void pushLocation()
    intervalRef.current = setInterval(() => void pushLocation(), UPDATE_INTERVAL_MS)
  }

  const handleToggle = async () => {
    setBusy(true)
    const next = !sharing

    if (next) {
      // Request permission up front by reading position once.
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          lastCoords.current = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          await setLocationSharing(true)
          setSharing(true)
          startTracking()
          setBusy(false)
        },
        async (err) => {
          console.log("[v0] permission error:", err.message)
          setStatus("Location permission denied. Enable it in your browser settings.")
          setBusy(false)
        },
        { enableHighAccuracy: true },
      )
    } else {
      stopTracking()
      await setLocationSharing(false)
      setSharing(false)
      setStatus(null)
      setBusy(false)
    }
  }

  // Resume tracking on mount if sharing was already on.
  useEffect(() => {
    if (initialSharing) startTracking()
    return () => stopTracking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleToggle}
        disabled={busy}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60 ${
          sharing
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
        aria-pressed={sharing}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : sharing ? (
          <MapPin className="h-4 w-4" />
        ) : (
          <MapPinOff className="h-4 w-4" />
        )}
        {sharing ? "Sharing location" : "Share location"}
      </button>
      {status && <span className="text-right text-[11px] text-slate-400">{status}</span>}
    </div>
  )
}
