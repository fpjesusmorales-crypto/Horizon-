"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function OpsSetupPage() {
  const [status, setStatus] = useState<"loading" | "linking" | "success" | "error" | "no_match">("loading")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function linkAccount() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/ops/auth/login")
        return
      }

      setUserEmail(user.email || "")

      // Check if user already has an employee record linked
      const { data: existingLink } = await supabase
        .from("employees")
        .select("id, role, first_name, last_name")
        .eq("user_id", user.id)
        .single()

      if (existingLink) {
        // Already linked, redirect based on role
        setStatus("success")
        setMessage(`Welcome back, ${existingLink.first_name}!`)
        setTimeout(() => {
          if (["admin", "dispatcher", "team_lead"].includes(existingLink.role)) {
            router.push("/ops/admin")
          } else {
            router.push("/ops/employee")
          }
        }, 1500)
        return
      }

      // Try to find an employee record with matching email
      const { data: matchingEmployee, error: matchError } = await supabase
        .from("employees")
        .select("id, email, role, first_name, last_name, user_id")
        .ilike("email", user.email || "")
        .single()

      if (matchError || !matchingEmployee) {
        setStatus("no_match")
        setMessage("No employee record found for your email. Please contact an administrator.")
        return
      }

      if (matchingEmployee.user_id) {
        setStatus("error")
        setMessage("This employee record is already linked to another account.")
        return
      }

      // Link the account
      setStatus("linking")
      const { error: updateError } = await supabase
        .from("employees")
        .update({ user_id: user.id })
        .eq("id", matchingEmployee.id)

      if (updateError) {
        console.log("[v0] Link error:", updateError)
        setStatus("error")
        setMessage("Failed to link account. Please try again or contact an administrator.")
        return
      }

      setStatus("success")
      setMessage(`Account linked successfully! Welcome, ${matchingEmployee.first_name}!`)
      
      // Redirect based on role
      setTimeout(() => {
        if (["admin", "dispatcher", "team_lead"].includes(matchingEmployee.role)) {
          router.push("/ops/admin")
        } else {
          router.push("/ops/employee")
        }
      }, 2000)
    }

    linkAccount()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">Operations Setup</h1>
        
        {userEmail && (
          <p className="mb-6 text-sm text-slate-500">
            Signed in as: {userEmail}
          </p>
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
            <p className="text-slate-600">Checking your account...</p>
          </div>
        )}

        {status === "linking" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-teal-500" />
            <p className="text-slate-600">Linking your account to employee record...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-12 w-12 text-teal-500" />
            <p className="text-slate-600">{message}</p>
            <p className="text-sm text-slate-400">Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-slate-600">{message}</p>
            <Link
              href="/ops/auth/login"
              className="mt-4 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Back to Login
            </Link>
          </div>
        )}

        {status === "no_match" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <AlertCircle className="h-12 w-12 text-amber-500" />
            <p className="text-slate-600">{message}</p>
            <p className="text-sm text-slate-400">
              Your email: {userEmail}
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/ops/auth/login"
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Try Different Account
              </Link>
              <Link
                href="/"
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Back to Website
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
