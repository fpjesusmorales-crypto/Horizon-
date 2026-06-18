"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, GitMerge } from "lucide-react"
import { runRecurringGeneration, syncBookingPipeline } from "@/app/actions/recurring"

export function RecurringGenerateButton() {
  const [running, setRunning] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleRun = async () => {
    setRunning(true)
    setMessage(null)
    const res = await runRecurringGeneration()
    if ("error" in res && res.error) {
      setMessage(res.error)
    } else if ("result" in res && res.result) {
      setMessage(
        `Created ${res.result.bookingsCreated} booking(s) and ${res.result.workOrdersCreated} work order(s) from due recurring services.`,
      )
      router.refresh()
    }
    setRunning(false)
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage(null)
    const res = await syncBookingPipeline()
    if ("error" in res && res.error) {
      setMessage(res.error)
    } else if ("result" in res && res.result) {
      setMessage(
        `Synced ${res.result.created} new work order(s) into the dispatch queue (${res.result.skipped} already linked).`,
      )
      router.refresh()
    }
    setSyncing(false)
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <GitMerge className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Bookings"}
        </button>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
          {running ? "Generating..." : "Generate Recurring"}
        </button>
      </div>
      {message && <p className="max-w-xs text-right text-xs text-slate-500">{message}</p>}
    </div>
  )
}
