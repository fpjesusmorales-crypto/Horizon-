"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from "lucide-react"

interface WorkOrder {
  id: string
  customer_name: string
  address: string
  city: string
  scheduled_date: string
  scheduled_time: string | null
  status: string
  service_type: string
  assigned_employee_id: string | null
  employee?: {
    id: string
    first_name: string
    last_name: string
  } | null
}

interface Employee {
  id: string
  first_name: string
  last_name: string
  role: string
}

interface ScheduleCalendarProps {
  initialJobs: WorkOrder[]
  employees: Employee[]
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  assigned: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  in_progress: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  completed: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
}

export function ScheduleCalendar({ initialJobs, employees }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [jobs, setJobs] = useState<WorkOrder[]>(initialJobs)
  const [view, setView] = useState<"week" | "day">("week")
  const [draggedJob, setDraggedJob] = useState<WorkOrder | null>(null)
  const supabase = createClient()

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    return d
  }

  const weekStart = getWeekStart(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const formatDate = (date: Date) => date.toISOString().split("T")[0]

  const getJobsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return jobs.filter((job) => job.scheduled_date === dateStr)
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, job: WorkOrder) => {
    setDraggedJob(job)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, date: Date, employeeId?: string) => {
    e.preventDefault()
    if (!draggedJob) return

    const newDate = formatDate(date)
    const updates: Partial<WorkOrder> = { scheduled_date: newDate }
    
    if (employeeId !== undefined) {
      updates.assigned_employee_id = employeeId
      if (employeeId && draggedJob.status === "pending") {
        Object.assign(updates, { status: "assigned" })
      }
    }

    // Update local state optimistically
    setJobs((prev) =>
      prev.map((j) =>
        j.id === draggedJob.id
          ? { ...j, ...updates, employee: employeeId ? employees.find((e) => e.id === employeeId) || null : j.employee }
          : j
      )
    )

    // Update database
    await supabase.from("work_orders").update(updates).eq("id", draggedJob.id)

    setDraggedJob(null)
  }

  const isToday = (date: Date) => formatDate(date) === formatDate(new Date())

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Schedule</h2>
          <div className="flex rounded-lg border border-slate-200">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1.5 text-sm font-medium ${view === "week" ? "bg-slate-100 text-slate-900" : "text-slate-600"}`}
            >
              Week
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1.5 text-sm font-medium ${view === "day" ? "bg-slate-100 text-slate-900" : "text-slate-600"}`}
            >
              Day
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Today
          </button>
          <button onClick={() => navigateWeek(-1)} className="rounded-lg p-1.5 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <span className="min-w-[180px] text-center text-sm font-medium text-slate-700">
            {weekStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <button onClick={() => navigateWeek(1)} className="rounded-lg p-1.5 hover:bg-slate-100">
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Week View */}
      {view === "week" && (
        <div className="grid grid-cols-7 divide-x divide-slate-200">
          {weekDays.map((date) => (
            <div
              key={formatDate(date)}
              className={`min-h-[400px] ${isToday(date) ? "bg-teal-50/30" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              {/* Day Header */}
              <div className={`border-b border-slate-200 p-2 text-center ${isToday(date) ? "bg-teal-100/50" : "bg-slate-50"}`}>
                <p className="text-xs text-slate-500">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className={`text-lg font-semibold ${isToday(date) ? "text-teal-700" : "text-slate-900"}`}>
                  {date.getDate()}
                </p>
              </div>

              {/* Jobs */}
              <div className="space-y-1 p-2">
                {getJobsForDate(date).map((job) => {
                  const colors = statusColors[job.status] || statusColors.pending
                  return (
                    <Link
                      key={job.id}
                      href={`/ops/admin/work-orders/${job.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job)}
                      className={`block cursor-move rounded-lg border p-2 text-xs transition hover:shadow-sm ${colors.bg} ${colors.border}`}
                    >
                      <p className={`font-medium truncate ${colors.text}`}>{job.customer_name}</p>
                      <div className="mt-1 flex items-center gap-1 text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{job.scheduled_time || "Flex"}</span>
                      </div>
                      {job.employee && (
                        <div className="mt-1 flex items-center gap-1 text-slate-500">
                          <User className="h-3 w-3" />
                          <span className="truncate">{job.employee.first_name}</span>
                        </div>
                      )}
                    </Link>
                  )
                })}

                {/* Add Job Button */}
                <Link
                  href={`/ops/admin/work-orders/new?date=${formatDate(date)}`}
                  className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 p-2 text-xs text-slate-400 hover:border-slate-400 hover:text-slate-500"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day View - with employee rows */}
      {view === "day" && (
        <div>
          {/* Current day header */}
          <div className="border-b border-slate-200 bg-slate-50 p-3 text-center">
            <p className="text-lg font-semibold text-slate-900">
              {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Employee rows */}
          <div className="divide-y divide-slate-200">
            {/* Unassigned row */}
            <div
              className="flex min-h-[80px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, currentDate, "")}
            >
              <div className="w-40 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-3">
                <p className="font-medium text-slate-500">Unassigned</p>
              </div>
              <div className="flex flex-1 flex-wrap gap-2 p-3">
                {getJobsForDate(currentDate)
                  .filter((j) => !j.assigned_employee_id)
                  .map((job) => {
                    const colors = statusColors[job.status] || statusColors.pending
                    return (
                      <Link
                        key={job.id}
                        href={`/ops/admin/work-orders/${job.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job)}
                        className={`cursor-move rounded-lg border p-2 text-xs ${colors.bg} ${colors.border}`}
                      >
                        <p className={`font-medium ${colors.text}`}>{job.customer_name}</p>
                        <p className="text-slate-500">{job.scheduled_time || "Flex"}</p>
                      </Link>
                    )
                  })}
              </div>
            </div>

            {/* Employee rows */}
            {employees
              .filter((e) => ["cleaner", "team_lead"].includes(e.role))
              .map((emp) => (
                <div
                  key={emp.id}
                  className="flex min-h-[80px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, currentDate, emp.id)}
                >
                  <div className="w-40 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{emp.first_name} {emp.last_name}</p>
                    <p className="text-xs text-slate-500 capitalize">{emp.role.replace("_", " ")}</p>
                  </div>
                  <div className="flex flex-1 flex-wrap gap-2 p-3">
                    {getJobsForDate(currentDate)
                      .filter((j) => j.assigned_employee_id === emp.id)
                      .map((job) => {
                        const colors = statusColors[job.status] || statusColors.pending
                        return (
                          <Link
                            key={job.id}
                            href={`/ops/admin/work-orders/${job.id}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, job)}
                            className={`cursor-move rounded-lg border p-2 text-xs ${colors.bg} ${colors.border}`}
                          >
                            <p className={`font-medium ${colors.text}`}>{job.customer_name}</p>
                            <div className="mt-1 flex items-center gap-2 text-slate-500">
                              <span>{job.scheduled_time || "Flex"}</span>
                              <span>-</span>
                              <span className="truncate">{job.address}</span>
                            </div>
                          </Link>
                        )
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
