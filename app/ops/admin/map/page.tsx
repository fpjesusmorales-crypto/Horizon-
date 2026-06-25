"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, User, Navigation, RefreshCw, Filter, Radio } from "lucide-react"
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api"
import { createClient } from "@/lib/supabase/client"
import { backfillJobCoordinates } from "@/app/actions/location"

interface WorkOrder {
  id: string
  customer_name: string
  address: string
  city: string
  scheduled_time: string
  status: string
  service_type: string
  latitude: number | null
  longitude: number | null
  assigned_employee: {
    id: string
    first_name: string
    last_name: string
  } | null
}

interface Employee {
  id: string
  first_name: string
  last_name: string
  color: string
  current_latitude: number | null
  current_longitude: number | null
  location_updated_at: string | null
  location_sharing: boolean
}

const employeeColors = [
  "#10B981", // teal
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
]

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const defaultCenter = {
  lat: 36.1627,
  lng: -86.7816, // Nashville, TN
}

export default function RouteMapPage() {
  const router = useRouter()
  const supabase = createClient()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedMarker, setSelectedMarker] = useState<WorkOrder | null>(null)
  const [selectedEmployeeMarker, setSelectedEmployeeMarker] = useState<Employee | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    // Backfill any jobs missing coordinates once, then load data.
    backfillJobCoordinates()
      .catch(() => {})
      .finally(() => fetchData())

    // Refresh every 30s so employee pins track live and new jobs appear.
    const interval = setInterval(() => fetchData(true), 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchData(silent = false) {
    if (!silent) setLoading(true)
    const today = new Date().toISOString().split("T")[0]

    // Fetch today's work orders
    const { data: orders } = await supabase
      .from("work_orders")
      .select(`
        id, customer_name, address, city, scheduled_time, status, service_type, latitude, longitude,
        assigned_employee:employees!work_orders_assigned_employee_id_fkey(id, first_name, last_name)
      `)
      .eq("scheduled_date", today)
      .neq("status", "cancelled")
      .order("scheduled_time")

    // Fetch employees including their live location
    const { data: emps } = await supabase
      .from("employees")
      .select("id, first_name, last_name, current_latitude, current_longitude, location_updated_at, location_sharing")
      .eq("status", "active")

    if (orders) {
      setWorkOrders(orders as unknown as WorkOrder[])
    }

    if (emps) {
      setEmployees(
        emps.map((emp, index) => ({
          ...emp,
          color: employeeColors[index % employeeColors.length],
        }))
      )
    }

    if (!silent) setLoading(false)
  }

  const filteredOrders = selectedEmployee === "all"
    ? workOrders
    : workOrders.filter((o) => o.assigned_employee?.id === selectedEmployee)

  const ordersWithCoords = filteredOrders.filter((o) => o.latitude && o.longitude)

  // Employees actively sharing a location, respecting the employee filter.
  const liveEmployees = employees.filter(
    (e) =>
      e.location_sharing &&
      e.current_latitude != null &&
      e.current_longitude != null &&
      (selectedEmployee === "all" || e.id === selectedEmployee),
  )

  const timeAgo = (iso: string | null) => {
    if (!iso) return "unknown"
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins === 1) return "1 min ago"
    if (mins < 60) return `${mins} mins ago`
    const hrs = Math.floor(mins / 60)
    return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`
  }

  const optimizeRoute = useCallback(async () => {
    if (ordersWithCoords.length < 2 || !isLoaded) return

    setOptimizing(true)
    const directionsService = new google.maps.DirectionsService()

    // Use first job as origin, last as destination
    const origin = { lat: ordersWithCoords[0].latitude!, lng: ordersWithCoords[0].longitude! }
    const destination = {
      lat: ordersWithCoords[ordersWithCoords.length - 1].latitude!,
      lng: ordersWithCoords[ordersWithCoords.length - 1].longitude!,
    }

    // Middle jobs as waypoints
    const waypoints = ordersWithCoords.slice(1, -1).map((order) => ({
      location: { lat: order.latitude!, lng: order.longitude! },
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
    } catch (error) {
      console.error("Error optimizing route:", error)
    }

    setOptimizing(false)
  }, [ordersWithCoords, isLoaded])

  const getEmployeeColor = (employeeId: string | undefined) => {
    if (!employeeId) return "#6B7280"
    const emp = employees.find((e) => e.id === employeeId)
    return emp?.color || "#6B7280"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "in_progress":
        return "#3B82F6"
      case "assigned":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/ops/admin" className="text-slate-500 hover:text-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Route Map</h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4">
        {/* Filters & Actions */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-slate-400" />
            <select
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value)
                setDirections(null)
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={optimizeRoute}
            disabled={ordersWithCoords.length < 2 || optimizing}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
          >
            <Navigation className="h-4 w-4" />
            {optimizing ? "Optimizing..." : "Optimize Route"}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{filteredOrders.length}</div>
            <div className="text-sm text-slate-500">Total Jobs</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-600">
              {filteredOrders.filter((o) => o.status === "pending" || o.status === "assigned").length}
            </div>
            <div className="text-sm text-slate-500">Pending</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {filteredOrders.filter((o) => o.status === "in_progress").length}
            </div>
            <div className="text-sm text-slate-500">In Progress</div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-teal-600">
              {filteredOrders.filter((o) => o.status === "completed").length}
            </div>
            <div className="text-sm text-slate-500">Completed</div>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={
                ordersWithCoords.length > 0
                  ? { lat: ordersWithCoords[0].latitude!, lng: ordersWithCoords[0].longitude! }
                  : defaultCenter
              }
              zoom={11}
            >
              {/* Job Markers */}
              {ordersWithCoords.map((order, index) => (
                <Marker
                  key={order.id}
                  position={{ lat: order.latitude!, lng: order.longitude! }}
                  label={{
                    text: String(index + 1),
                    color: "white",
                    fontWeight: "bold",
                  }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: getEmployeeColor(order.assigned_employee?.id),
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                  }}
                  onClick={() => setSelectedMarker(order)}
                />
              ))}

              {/* Info Window */}
              {selectedMarker && (
                <InfoWindow
                  position={{ lat: selectedMarker.latitude!, lng: selectedMarker.longitude! }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="max-w-xs p-2">
                    <h3 className="font-semibold text-slate-900">{selectedMarker.customer_name}</h3>
                    <p className="text-sm text-slate-600">{selectedMarker.address}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {selectedMarker.scheduled_time || "No time set"}
                    </div>
                    {selectedMarker.assigned_employee && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <User className="h-3 w-3" />
                        {selectedMarker.assigned_employee.first_name} {selectedMarker.assigned_employee.last_name}
                      </div>
                    )}
                    <div className="mt-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                        style={{
                          backgroundColor: getStatusColor(selectedMarker.status) + "20",
                          color: getStatusColor(selectedMarker.status),
                        }}
                      >
                        {selectedMarker.status.replace("_", " ")}
                      </span>
                    </div>
                    <Link
                      href={`/ops/admin/work-orders/${selectedMarker.id}`}
                      className="mt-2 block text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </InfoWindow>
              )}

              {/* Live Employee Markers */}
              {liveEmployees.map((emp) => (
                <Marker
                  key={`emp-${emp.id}`}
                  position={{ lat: emp.current_latitude!, lng: emp.current_longitude! }}
                  onClick={() => setSelectedEmployeeMarker(emp)}
                  zIndex={1000}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: emp.color,
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 2,
                    scale: 1.6,
                    anchor: new google.maps.Point(12, 22),
                  }}
                  title={`${emp.first_name} ${emp.last_name}`}
                />
              ))}

              {/* Employee Info Window */}
              {selectedEmployeeMarker && (
                <InfoWindow
                  position={{
                    lat: selectedEmployeeMarker.current_latitude!,
                    lng: selectedEmployeeMarker.current_longitude!,
                  }}
                  onCloseClick={() => setSelectedEmployeeMarker(null)}
                >
                  <div className="max-w-xs p-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: selectedEmployeeMarker.color }}
                      />
                      <h3 className="font-semibold text-slate-900">
                        {selectedEmployeeMarker.first_name} {selectedEmployeeMarker.last_name}
                      </h3>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Radio className="h-3 w-3 text-teal-600" />
                      Live location · {timeAgo(selectedEmployeeMarker.location_updated_at)}
                    </p>
                  </div>
                </InfoWindow>
              )}

              {/* Optimized Route */}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          ) : (
            <div className="flex h-[600px] items-center justify-center bg-slate-100">
              <p className="text-slate-500">Loading map...</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Employee Legend</h3>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Radio className={`h-3.5 w-3.5 ${liveEmployees.length > 0 ? "text-teal-600" : "text-slate-300"}`} />
              {liveEmployees.length > 0
                ? `${liveEmployees.length} sharing location`
                : "No live locations"}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {employees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: emp.color }}
                />
                <span className="text-sm text-slate-600">
                  {emp.first_name} {emp.last_name}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <span className="text-sm text-slate-600">Unassigned</span>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-900">Today&apos;s Route ({filteredOrders.length} jobs)</h3>
          <div className="space-y-2">
            {filteredOrders.map((order, index) => (
              <Link
                key={order.id}
                href={`/ops/admin/work-orders/${order.id}`}
                className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: getEmployeeColor(order.assigned_employee?.id) }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{order.customer_name}</div>
                  <div className="text-sm text-slate-500">{order.address}, {order.city}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-600">{order.scheduled_time || "No time"}</div>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
                    style={{
                      backgroundColor: getStatusColor(order.status) + "20",
                      color: getStatusColor(order.status),
                    }}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
            {filteredOrders.length === 0 && (
              <p className="py-8 text-center text-slate-500">No jobs scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
