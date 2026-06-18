"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { runRecurringGeneration } from "@/app/actions/recurring"

export function RecurringGenerateButton() {
  const [running, setRunning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleRun = async () => {
    setRunning(true)
    setMessage(null)
    const res = await runRecurringGeneration()
    if (res.error) {
      setMessage(res.error)
    } else if (res.result) {
      setMessage(
        `Created ${res.result.created} booking(s) from ${res.result.processed} due service(s).` +
          (res.result.errors.length ? ` ${res.result.errors.length} error(s).` : ""),
      )
      router.refresh()
    }
    setRunning(false)
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRun}
        disabled={running}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
        {running ? "Generating..." : "Generate Recurring"}
      </button>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  )
}
