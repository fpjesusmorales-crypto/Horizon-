import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Download, Calendar, Clock, DollarSign, Users } from "lucide-react"

interface WorkOrder {
  id: string
  customer_name: string
  scheduled_date: string
  check_in_time: string | null
  check_out_time: string | null
  status: string
  assigned_employee_id: string | null
  employee: {
    id: string
    first_name: string
    last_name: string
    hourly_rate: number | null
  } | null
}

export default async function ReportsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/ops/auth/login")

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher"].includes(employee.role)) {
    redirect("/ops/admin")
  }

  // Get date range (last 30 days by default)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  // Fetch completed work orders with time tracking
  const { data: completedJobs } = await supabase
    .from("work_orders")
    .select(`
      id,
      customer_name,
      scheduled_date,
      check_in_time,
      check_out_time,
      status,
      assigned_employee_id,
      employee:employees(id, first_name, last_name, hourly_rate)
    `)
    .eq("status", "completed")
    .gte("scheduled_date", startDate.toISOString().split("T")[0])
    .lte("scheduled_date", endDate.toISOString().split("T")[0])
    .order("scheduled_date", { ascending: false })

  // Fetch all employees for summary
  const { data: employees } = await supabase
    .from("employees")
    .select("id, first_name, last_name, hourly_rate, role")
    .in("role", ["cleaner", "team_lead"])
    .eq("status", "active")

  // Calculate stats
  const calculateDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }

  // Employee summaries
  const employeeSummaries = employees?.map((emp) => {
    const empJobs = (completedJobs as WorkOrder[])?.filter(
      (job) => job.assigned_employee_id === emp.id
    ) || []
    
    const totalHours = empJobs.reduce(
      (sum, job) => sum + calculateDuration(job.check_in_time, job.check_out_time),
      0
    )
    
    const totalPay = totalHours * (emp.hourly_rate || 0)
    
    return {
      ...emp,
      jobsCompleted: empJobs.length,
      totalHours,
      totalPay,
    }
  }) || []

  const totalJobsCompleted = (completedJobs as WorkOrder[])?.length || 0
  const totalHoursWorked = employeeSummaries.reduce((sum, emp) => sum + emp.totalHours, 0)
  const totalPayroll = employeeSummaries.reduce((sum, emp) => sum + emp.totalPay, 0)

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-20 h-full w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/ops/admin" className="text-xl font-bold text-slate-900">
            Horizon Ops
          </Link>
        </div>
        <nav className="p-4">
          <Link href="/ops/admin" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Time & Payroll Report</h1>
            <p className="text-slate-500">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-teal-100 p-2">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Jobs Completed</p>
                <p className="text-2xl font-bold text-slate-900">{totalJobsCompleted}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Hours</p>
                <p className="text-2xl font-bold text-slate-900">{formatDuration(totalHoursWorked)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Est. Payroll</p>
                <p className="text-2xl font-bold text-slate-900">${totalPayroll.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Employees</p>
                <p className="text-2xl font-bold text-slate-900">{employees?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Breakdown */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Employee Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Jobs</th>
                  <th className="pb-3 font-medium">Hours Worked</th>
                  <th className="pb-3 font-medium">Hourly Rate</th>
                  <th className="pb-3 font-medium text-right">Est. Pay</th>
                </tr>
              </thead>
              <tbody>
                {employeeSummaries.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100">
                    <td className="py-4">
                      <p className="font-medium text-slate-900">{emp.first_name} {emp.last_name}</p>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
                        {emp.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">{emp.jobsCompleted}</td>
                    <td className="py-4 text-slate-600">{formatDuration(emp.totalHours)}</td>
                    <td className="py-4 text-slate-600">${emp.hourly_rate?.toFixed(2) || "0.00"}/hr</td>
                    <td className="py-4 text-right font-medium text-slate-900">${emp.totalPay.toFixed(2)}</td>
                  </tr>
                ))}
                {employeeSummaries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No employee data available
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold">
                  <td className="py-4 text-slate-900">Total</td>
                  <td className="py-4"></td>
                  <td className="py-4 text-slate-900">{totalJobsCompleted}</td>
                  <td className="py-4 text-slate-900">{formatDuration(totalHoursWorked)}</td>
                  <td className="py-4"></td>
                  <td className="py-4 text-right text-slate-900">${totalPayroll.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Recent Jobs Detail */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Job Time Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Employee</th>
                  <th className="pb-3 font-medium">Check In</th>
                  <th className="pb-3 font-medium">Check Out</th>
                  <th className="pb-3 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                {(completedJobs as WorkOrder[])?.slice(0, 20).map((job) => {
                  const duration = calculateDuration(job.check_in_time, job.check_out_time)
                  return (
                    <tr key={job.id} className="border-b border-slate-100">
                      <td className="py-3 text-sm text-slate-600">
                        {new Date(job.scheduled_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm font-medium text-slate-900">{job.customer_name}</td>
                      <td className="py-3 text-sm text-slate-600">
                        {job.employee ? `${job.employee.first_name} ${job.employee.last_name}` : "—"}
                      </td>
                      <td className="py-3 text-sm text-slate-600">
                        {job.check_in_time ? new Date(job.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 text-sm text-slate-600">
                        {job.check_out_time ? new Date(job.check_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 text-sm font-medium text-slate-900">
                        {duration > 0 ? formatDuration(duration) : "—"}
                      </td>
                    </tr>
                  )
                })}
                {(!completedJobs || completedJobs.length === 0) && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No completed jobs with time data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
