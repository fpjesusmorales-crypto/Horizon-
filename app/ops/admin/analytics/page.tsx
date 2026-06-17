import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArrowLeft, DollarSign, ClipboardCheck, Star, Users } from "lucide-react"
import { RevenueChart, JobsChart } from "@/components/ops/analytics-charts"

export const metadata = {
  title: "Analytics | Horizon Operations",
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/ops/auth/login")
  }

  // Verify the user is an ops manager
  const { data: employee } = await supabase
    .from("employees")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!employee || !["admin", "dispatcher", "team_lead"].includes(employee.role)) {
    redirect("/ops/auth/login")
  }

  // Pull data for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  const startDate = sixMonthsAgo.toISOString().split("T")[0]

  const { data: workOrders } = await supabase
    .from("work_orders")
    .select("id, status, scheduled_date, service_type")
    .gte("scheduled_date", startDate)

  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("amount, status, created_at")
    .eq("status", "paid")
    .gte("created_at", sixMonthsAgo.toISOString())

  const { data: reviews } = await supabase.from("reviews").select("rating")

  const { count: customerCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  // Build the last 6 month buckets
  const buckets: { key: string; month: string; revenue: number; completed: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: MONTH_LABELS[d.getMonth()],
      revenue: 0,
      completed: 0,
    })
  }
  const bucketByKey = new Map(buckets.map((b) => [b.key, b]))

  for (const inv of paidInvoices || []) {
    const d = new Date(inv.created_at)
    const b = bucketByKey.get(`${d.getFullYear()}-${d.getMonth()}`)
    if (b) b.revenue += Number(inv.amount) || 0
  }

  for (const wo of workOrders || []) {
    if (wo.status !== "completed" || !wo.scheduled_date) continue
    const d = new Date(wo.scheduled_date)
    const b = bucketByKey.get(`${d.getFullYear()}-${d.getMonth()}`)
    if (b) b.completed += 1
  }

  const totalRevenue = (paidInvoices || []).reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
  const completedJobs = (workOrders || []).filter((w) => w.status === "completed").length
  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—"

  const stats = [
    {
      label: "Revenue (6 mo)",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-teal-100 text-teal-600",
    },
    {
      label: "Jobs Completed",
      value: completedJobs.toString(),
      icon: ClipboardCheck,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: Star,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Total Customers",
      value: (customerCount ?? 0).toString(),
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/ops/admin" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
            <p className="text-sm text-slate-500">Business performance over the last 6 months</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Monthly Revenue</h2>
            <RevenueChart data={buckets.map((b) => ({ month: b.month, revenue: b.revenue }))} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Jobs Completed</h2>
            <JobsChart data={buckets.map((b) => ({ month: b.month, completed: b.completed }))} />
          </div>
        </div>
      </main>
    </div>
  )
}
