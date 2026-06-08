"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Clock, CheckCircle, Truck, Sparkles, Calendar } from "lucide-react"

interface Booking {
  id: string
  service_type: string
  scheduled_date: string
  scheduled_time: string
  status: string
  // From work_orders
  work_order?: {
    id: string
    status: string
    check_in_time: string | null
    check_out_time: string | null
    assigned_employee: {
      first_name: string
    } | null
  } | null
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  scheduled: {
    icon: <Calendar className="h-5 w-5" />,
    label: "Scheduled",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  pending: {
    icon: <Clock className="h-5 w-5" />,
    label: "Pending Confirmation",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  assigned: {
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Confirmed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  in_progress: {
    icon: <Sparkles className="h-5 w-5" />,
    label: "Cleaning in Progress",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  en_route: {
    icon: <Truck className="h-5 w-5" />,
    label: "Cleaner En Route",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  completed: {
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
}

export function LiveJobStatus({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<string>("scheduled")
  const [workOrder, setWorkOrder] = useState<Booking["work_order"]>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStatus()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "work_orders",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setWorkOrder(payload.new as Booking["work_order"])
          setStatus(payload.new.status)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId])

  async function fetchStatus() {
    setLoading(true)
    
    // Get booking status
    const { data: booking } = await supabase
      .from("bookings")
      .select("status")
      .eq("id", bookingId)
      .single()

    if (booking) {
      setStatus(booking.status)
    }

    // Check for associated work order
    const { data: workOrderData } = await supabase
      .from("work_orders")
      .select(`
        id,
        status,
        check_in_time,
        check_out_time,
        assigned_employee:employees!work_orders_assigned_employee_id_fkey(first_name)
      `)
      .eq("booking_id", bookingId)
      .single()

    if (workOrderData) {
      setWorkOrder(workOrderData as Booking["work_order"])
      setStatus(workOrderData.status)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-xl bg-slate-100 p-4">
        <div className="h-4 w-24 rounded bg-slate-200"></div>
      </div>
    )
  }

  const config = statusConfig[status] || statusConfig.scheduled

  return (
    <div className={`rounded-xl p-4 ${config.bgColor}`}>
      <div className="flex items-center gap-3">
        <div className={config.color}>{config.icon}</div>
        <div>
          <p className={`font-semibold ${config.color}`}>{config.label}</p>
          {status === "in_progress" && workOrder?.check_in_time && (
            <p className="text-sm text-slate-600">
              Started at {new Date(workOrder.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
          {workOrder?.assigned_employee && status !== "completed" && (
            <p className="text-sm text-slate-600">
              Cleaner: {workOrder.assigned_employee.first_name}
            </p>
          )}
          {status === "completed" && workOrder?.check_out_time && (
            <p className="text-sm text-slate-600">
              Completed at {new Date(workOrder.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>

      {/* Progress indicator for in-progress jobs */}
      {status === "in_progress" && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-purple-400"></div>
            </div>
            <span className="text-xs text-purple-600">In progress...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Standalone status tracker page component
export function JobStatusTracker({ userId }: { userId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBookings()
  }, [userId])

  async function fetchBookings() {
    setLoading(true)
    const today = new Date().toISOString().split("T")[0]
    
    const { data } = await supabase
      .from("bookings")
      .select("id, service_type, scheduled_date, scheduled_time, status")
      .eq("user_id", userId)
      .gte("scheduled_date", today)
      .order("scheduled_date", { ascending: true })
      .limit(5)

    if (data) {
      setBookings(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center text-slate-500">Loading...</div>
  }

  if (bookings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900">Live Status</h3>
      {bookings.map((booking) => (
        <div key={booking.id} className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900 capitalize">
              {booking.service_type} Clean
            </span>
            <span className="text-sm text-slate-500">
              {new Date(booking.scheduled_date).toLocaleDateString()}
            </span>
          </div>
          <LiveJobStatus bookingId={booking.id} />
        </div>
      ))}
    </div>
  )
}
