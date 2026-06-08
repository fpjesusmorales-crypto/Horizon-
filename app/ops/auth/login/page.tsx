"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function OpsLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // First, check if user is already linked to an employee record
      let { data: employee, error: empError } = await supabase
        .from("employees")
        .select("id, role, status")
        .eq("user_id", authData.user.id)
        .single()

      // If not linked, try to find employee by email and link the account
      if (empError || !employee) {
        const { data: employeeByEmail } = await supabase
          .from("employees")
          .select("id, role, status, user_id")
          .eq("email", email.toLowerCase())
          .single()

        if (employeeByEmail && !employeeByEmail.user_id) {
          // Link the user_id to this employee record
          const { error: linkError } = await supabase
            .from("employees")
            .update({ user_id: authData.user.id })
            .eq("id", employeeByEmail.id)

          if (!linkError) {
            employee = employeeByEmail
          }
        } else if (employeeByEmail) {
          employee = employeeByEmail
        }
      }

      if (!employee) {
        await supabase.auth.signOut()
        throw new Error("You are not authorized to access the operations portal. Contact your administrator.")
      }

      if (employee.status !== "active") {
        await supabase.auth.signOut()
        throw new Error("Your employee account is inactive. Please contact your manager.")
      }

      // Redirect based on role
      if (employee.role === "admin" || employee.role === "dispatcher" || employee.role === "team_lead") {
        router.push("/ops/admin")
      } else {
        router.push("/ops/employee")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">Horizon Operations</h1>
          </Link>
          <p className="mt-2 text-slate-400">Staff Portal Login</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
              Back to website
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          For employee accounts, contact your manager.
        </p>
      </div>
    </div>
  )
}
