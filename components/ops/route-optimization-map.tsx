"use client"

import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api"
import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Navigation, Clock, MapPin, Route, RefreshCw } from "lucide-react"

interface WorkOrder {
  id: string
  customer_name: string
  address: string
  city: string
  zip: string
  latitude: number | null
  longitude: number | null
  status: string
  scheduled_time: string | null
  service_type: string
  estimated_duration: number
  employee?: {
    id: string
    first_name: string
    last_name: string
  } | null
}

interface RouteMapProps {
  jobs: WorkOrder[]
  selectedEmployeeId?: string | null
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const defaultCenter = {
  lat: 32.7157,
  lng: -117.1611,
}

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  assigned: "#3b82f6",
  in_progress: "#8b5cf6",
  completed: "#10b981",
  cancelled: "#ef4444",
}

export function RouteOptimizationMap({ jobs, selectedEmployeeId }: RouteMapProps) {
  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [optimizedOrder, setOptimizedOrder] = useState<WorkOrder[]>([])
  const [totalDuration, setTotalDuration] = useState<string>("")
  const [totalDistance, setTotalDistance] = useState<string>("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [authFailed, setAuthFailed] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  })

  // Google reports key/billing/referrer rejections via a global callback,
  // NOT through loadError. Capture it so we can show a useful message
  // instead of Google's blank gray "Oops! Something went wrong" overlay.
  useEffect(() => {
    ;(window as typeof window & { gm_authFailure?: () => void }).gm_authFailure = () => {
      console.log("[v0] Google Maps gm_authFailure triggered")
      setAuthFailed(true)
    }
  }, [])

  const mappableJobs = jobs.filter((j) => j.latitude && j.longitude)
  
  const filteredJobs = selectedEmployeeId 
    ? mappableJobs.filter(j => j.employee?.id === selectedEmployeeId)
    : mappableJobs

  const mapCenter = filteredJobs.length > 0 
    ? {
        lat: filteredJobs.reduce((sum, j) => sum + (j.latitude || 0), 0) / filteredJobs.length,
        lng: filteredJobs.reduce((sum, j) => sum + (j.longitude || 0), 0) / filteredJobs.length,
      }
    : defaultCenter

  const optimizeRoute = useCallback(async () => {
    if (!isLoaded || filteredJobs.length < 2) return
    
    setIsOptimizing(true)
    
    const directionsService = new google.maps.DirectionsService()
    
    // Use first job as origin, last as destination, rest as waypoints
    const origin = { lat: filteredJobs[0].latitude!, lng: filteredJobs[0].longitude! }
    const destination = filteredJobs.length > 1 
      ? { lat: filteredJobs[filteredJobs.length - 1].latitude!, lng: filteredJobs[filteredJobs.length - 1].longitude! }
      : origin
    
    const waypoints = filteredJobs.slice(1, -1).map(job => ({
      location: { lat: job.latitude!, lng: job.longitude! },
      stopover: true,
    }))

    try {
      const result = await directionsService.route({
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      setDirections(result)
      
      // Reorder jobs based on optimized route
      if (result.routes[0]?.waypoint_order) {
        const waypointOrder = result.routes[0].waypoint_order
        const middleJobs = filteredJobs.slice(1, -1)
        const reorderedMiddle = waypointOrder.map(i => middleJobs[i])
        const optimized = [filteredJobs[0], ...reorderedMiddle, filteredJobs[filteredJobs.length - 1]]
        setOptimizedOrder(optimized)
      } else {
        setOptimizedOrder(filteredJobs)
      }

      // Calculate totals
      const legs = result.routes[0]?.legs || []
      const totalDurationSec = legs.reduce((sum, leg) => sum + (leg.duration?.value || 0), 0)
      const totalDistanceM = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0)
      
      const hours = Math.floor(totalDurationSec / 3600)
      const minutes = Math.floor((totalDurationSec % 3600) / 60)
      setTotalDuration(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)
      setTotalDistance(`${(totalDistanceM / 1609.34).toFixed(1)} mi`)
    } catch (error) {
      console.error("Route optimization failed:", error)
    }
    
    setIsOptimizing(false)
  }, [isLoaded, filteredJobs])

  useEffect(() => {
    if (isLoaded && filteredJobs.length >= 2) {
      optimizeRoute()
    }
  }, [isLoaded, filteredJobs.length, selectedEmployeeId, optimizeRoute])

  const onMapClick = useCallback(() => {
    setSelectedJob(null)
  }, [])

  const getMarkerLabel = (index: number) => ({
    text: String(index + 1),
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "bold",
  })

  if (!apiKey) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100 p-6 text-center text-slate-600">
        <MapPin className="h-8 w-8 text-slate-400" />
        <p className="font-semibold text-slate-900">Map unavailable</p>
        <p className="max-w-md text-sm">
          The <code className="rounded bg-slate-200 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> environment
          variable is not set for this deployment. Add it in your project settings and redeploy.
        </p>
      </div>
    )
  }

  if (loadError || authFailed) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100 p-6 text-center text-slate-600">
        <MapPin className="h-8 w-8 text-slate-400" />
        <p className="font-semibold text-slate-900">Google rejected this Maps API key</p>
        <p className="max-w-md text-sm">
          The key is set correctly, but Google blocked the request. Open the{" "}
          <a
            href="https://console.cloud.google.com/google/maps-apis/api-list"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-700 underline underline-offset-2"
          >
            Google Cloud Console
          </a>{" "}
          and verify all of the following for this key&apos;s project:
        </p>
        <ul className="max-w-md list-inside list-disc text-left text-sm">
          <li>Billing is enabled on the project (required even for free usage)</li>
          <li>&quot;Maps JavaScript API&quot; is enabled</li>
          <li>&quot;Directions API&quot; is enabled (used for route optimization)</li>
          <li>&quot;Places API&quot; is enabled (the map loads the places library)</li>
          <li>
            Under the key&apos;s <strong>Application restrictions → Website restrictions</strong>, add{" "}
            <code className="rounded bg-slate-200 px-1">horizonoperations.cleaning/*</code> and{" "}
            <code className="rounded bg-slate-200 px-1">*.vusercontent.net/*</code>
          </li>
        </ul>
        <p className="max-w-md text-xs text-slate-400">
          Tip: open the browser console (F12) on this page to see the exact error code (e.g.
          ApiNotActivatedMapError, BillingNotEnabledMapError, or RefererNotAllowedMapError).
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        Loading map...
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Map */}
      <div className="col-span-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={11}
            onClick={onMapClick}
            options={{
              styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#0d9488",
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}

            {(optimizedOrder.length > 0 ? optimizedOrder : filteredJobs).map((job, index) => (
              <Marker
                key={job.id}
                position={{ lat: job.latitude!, lng: job.longitude! }}
                label={getMarkerLabel(index)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: statusColors[job.status] || "#64748b",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                  scale: 15,
                }}
                onClick={() => setSelectedJob(job)}
              />
            ))}

            {selectedJob && selectedJob.latitude && selectedJob.longitude && (
              <InfoWindow
                position={{ lat: selectedJob.latitude, lng: selectedJob.longitude }}
                onCloseClick={() => setSelectedJob(null)}
              >
                <div className="max-w-[220px] p-1">
                  <p className="font-semibold text-slate-900">{selectedJob.customer_name}</p>
                  <p className="text-sm text-slate-600">{selectedJob.address}, {selectedJob.city}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedJob.service_type} - {selectedJob.estimated_duration} min
                  </p>
                  <p className="text-xs text-slate-500">{selectedJob.scheduled_time || "Flexible"}</p>
                  <Link
                    href={`/ops/admin/work-orders/${selectedJob.id}`}
                    className="mt-2 block text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    View Details
                  </Link>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>

      {/* Route Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Optimized Route</h3>
          <button
            onClick={optimizeRoute}
            disabled={isOptimizing || filteredJobs.length < 2}
            className="flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isOptimizing ? "animate-spin" : ""}`} />
            Optimize
          </button>
        </div>

        {/* Route Stats */}
        {totalDuration && totalDistance && (
          <div className="mb-4 flex gap-4 rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{totalDistance}</span>
            </div>
          </div>
        )}

        {/* Job List */}
        <div className="space-y-2">
          {(optimizedOrder.length > 0 ? optimizedOrder : filteredJobs).map((job, index) => (
            <Link
              key={job.id}
              href={`/ops/admin/work-orders/${job.id}`}
              className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: statusColors[job.status] || "#64748b" }}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{job.customer_name}</p>
                <p className="text-xs text-slate-500 truncate">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {job.address}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span>{job.scheduled_time || "Flex"}</span>
                  <span>-</span>
                  <span>{job.estimated_duration}m</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address + ", " + job.city + ", " + job.zip)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
              >
                <Navigation className="h-4 w-4" />
              </a>
            </Link>
          ))}

          {filteredJobs.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              No jobs to display. Select an employee or add jobs for today.
            </div>
          )}

          {filteredJobs.length === 1 && (
            <div className="py-4 text-center text-sm text-slate-500">
              Add more jobs to optimize route.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
