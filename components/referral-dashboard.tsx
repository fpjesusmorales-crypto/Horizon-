"use client"

import { useState } from "react"
import { Copy, Check, Gift, Users, DollarSign } from "lucide-react"
import { sendReferral } from "@/app/actions/referrals"

interface Referral {
  id: string
  referred_email: string
  referred_name: string | null
  status: string
  reward_amount: number
  created_at: string
}

interface ReferralDashboardProps {
  referralCode: string
  creditBalance: number
  referrals: Referral[]
}

export function ReferralDashboard({ referralCode, creditBalance, referrals }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/book?ref=${referralCode}`
      : `/book?ref=${referralCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await sendReferral(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Referral sent! You'll earn $25 once they complete their first cleaning." })
      e.currentTarget.reset()
    }
    setSending(false)
  }

  const completedCount = referrals.filter((r) => r.status !== "pending").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <DollarSign className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">${creditBalance.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Available Credit</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{referrals.length}</p>
              <p className="text-sm text-slate-500">Friends Referred</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Gift className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
              <p className="text-sm text-slate-500">Rewards Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share link */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Your Referral Link</h2>
        <p className="mt-1 text-sm text-slate-600">
          Share this link with friends. When they book their first cleaning, you both get $25 off.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {shareLink}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Link"}
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Or share your code: <span className="font-mono font-semibold text-slate-900">{referralCode}</span>
        </p>
      </div>

      {/* Send referral by email */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Invite by Email</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Friend&apos;s Name (optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Friend&apos;s Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-teal-500 focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>
          </div>
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>

      {/* Referral history */}
      {referrals.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Referral History</h2>
          <div className="mt-4 space-y-3">
            {referrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">{ref.referred_name || ref.referred_email}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(ref.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    ref.status === "rewarded"
                      ? "bg-green-100 text-green-700"
                      : ref.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {ref.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
