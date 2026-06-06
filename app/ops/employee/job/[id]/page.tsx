"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, MapPin, Clock, Phone, Mail, CheckCircle, Camera, Navigation, AlertCircle } from "lucide-react"
import { PhotoUpload } from "@/components/ops/photo-upload"

interface WorkOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  city: string
  zip: string
  latitude: number | null
  longitude: number | null
  service_type: string
  scheduled_date: string
  scheduled_time: string
  estimated_duration: number
  status: string
  checklist_completed: { id: string; completed: boolean }[]
  check_in_time: string | null
  check_out_time: string | null
  before_photos: string[]
  after_photos: string[]
  notes: string
  employee_notes: string
}

interface ChecklistItem {
  id: string
  task: string
  area: string
}

interface Checklist {
  id: string
  name: string
  items: ChecklistItem[]
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [job, setJob] = useState<WorkOrder | null>(null)
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({})
  const [employeeNotes, setEmployeeNotes] = useState("")
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos, setAfterPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifying, setNotifying] = useState(false)
  const [enRouteSent, setEnRouteSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadJob() {
      const { id } = await params
      
      const { data: jobData, error } = await supabase
        .from("work_orders")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !jobData) {
        router.push("/ops/employee")
        return
      }

      setJob(jobData)
      setEmployeeNotes(jobData.employee_notes || "")
      setBeforePhotos(jobData.before_photos || [])
      setAfterPhotos(jobData.after_photos || [])

      // Load completed items
      if (jobData.checklist_completed) {
        const completed: Record<string, boolean> = {}
        jobData.checklist_completed.forEach((item: { id: string; completed: boolean }) => {
          completed[item.id] = item.completed
        })
        setCompletedItems(completed)
      }

      // Load checklist template
      if (jobData.checklist_template_id) {
        const { data: checklistData } = await supabase
          .from("cleaning_checklists")
          .select("*")
          .eq("id", jobData.checklist_template_id)
          .single()
        
        if (checklistData) {
          setChecklist({
            ...checklistData,
            items: typeof checklistData.items === 'string' 
              ? JSON.parse(checklistData.items) 
              : checklistData.items
          })
        }
      } else {
        // Load default checklist based on service type
        const serviceType = jobData.service_type.toLowerCase().includes("deep") ? "deep" 
          : jobData.service_type.toLowerCase().includes("move") ? "move" 
          : "standard"
        
        const { data: checklistData } = await supabase
          .from("cleaning_checklists")
          .select("*")
          .eq("service_type", serviceType)
          .single()
        
        if (checklistData) {
          setChecklist({
            ...checklistData,
            items: typeof checklistData.items === 'string' 
              ? JSON.parse(checklistData.items) 
              : checklistData.items
          })
        }
      }

      setLoading(false)
    }

    loadJob()
  }, [params, router, supabase])

  const handleCheckIn = async () => {
    if (!job) return
    setSaving(true)
    
    const { error } = await supabase
      .from("work_orders")
      .update({ 
        status: "in_progress",
        check_in_time: new Date().toISOString()
      })
      .eq("id", job.id)

    if (!error) {
      setJob({ ...job, status: "in_progress", check_in_time: new Date().toISOString() })
      // Notify customer that the cleaning has started
      fetch("/api/ops/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId: job.id, type: "started" }),
      }).catch((err) => console.error("[v0] SMS error:", err))
    }
    setSaving(false)
  }

  const handleNotifyEnRoute = async () => {
    if (!job) return
    setNotifying(true)
    try {
      const res = await fetch("/api/ops/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId: job.id, type: "en_route", eta: "15-20 minutes" }),
      })
      if (res.ok) {
        setEnRouteSent(true)
      }
    } catch (err) {
      console.error("[v0] En route SMS error:", err)
    }
    setNotifying(false)
  }

  const handleCheckOut = async () => {
    if (!job) return
    setSaving(true)

    const checklistItems = checklist?.items.map(item => ({
      id: item.id,
      completed: completedItems[item.id] || false
    })) || []

    const { error } = await supabase
      .from("work_orders")
      .update({ 
        status: "completed",
        check_out_time: new Date().toISOString(),
        checklist_completed: checklistItems,
        employee_notes: employeeNotes,
        before_photos: beforePhotos,
        after_photos: afterPhotos
      })
      .eq("id", job.id)

    if (!error) {
      // Notify customer that the cleaning is complete
      fetch("/api/ops/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workOrderId: job.id, type: "complete" }),
      }).catch((err) => console.error("[v0] SMS error:", err))
      router.push("/ops/employee")
    }
    setSaving(false)
  }

  const toggleChecklistItem = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const openDirections = () => {
    if (!job) return
    const address = encodeURIComponent(`${job.address}, ${job.city} ${job.zip}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, "_blank")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (!job) return null

  const completedCount = Object.values(completedItems).filter(Boolean).length
  const totalItems = checklist?.items.length || 0

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link href="/ops/employee" className="rounded-lg p-1 hover:bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-slate-900">{job.customer_name}</h1>
            <p className="text-sm text-slate-500">{job.service_type}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
            job.status === "completed" ? "bg-green-100 text-green-700" :
            job.status === "in_progress" ? "bg-blue-100 text-blue-700" :
            "bg-yellow-100 text-yellow-700"
          }`}>
            {job.status.replace("_", " ")}
          </span>
        </div>
      </header>

      <main className="p-4">
        {/* Location Card */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="mt-1 text-slate-900">{job.address}</p>
              <p className="text-sm text-slate-600">{job.city} {job.zip}</p>
            </div>
            <button
              onClick={openDirections}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Navigation className="h-4 w-4" />
              Directions
            </button>
          </div>
        </div>

        {/* Schedule & Contact */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Schedule</span>
            </div>
            <p className="mt-1 font-medium text-slate-900">{job.scheduled_time || "Flexible"}</p>
            <p className="text-xs text-slate-500">~{job.estimated_duration} min</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Phone className="h-4 w-4" />
              <span className="text-xs">Contact</span>
            </div>
            {job.customer_phone ? (
              <a href={`tel:${job.customer_phone}`} className="mt-1 block font-medium text-teal-600">
                {job.customer_phone}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-400">No phone</p>
            )}
          </div>
        </div>

        {/* Notes */}
        {job.notes && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Special Instructions</span>
            </div>
            <p className="mt-1 text-sm text-amber-800">{job.notes}</p>
          </div>
        )}

        {/* Checklist */}
        {checklist && checklist.items.length > 0 && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Cleaning Checklist</h2>
              <span className="text-sm text-slate-500">{completedCount}/{totalItems}</span>
            </div>
            <div className="space-y-2">
              {checklist.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                    completedItems[item.id] ? "bg-green-50" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    completedItems[item.id] 
                      ? "border-green-500 bg-green-500" 
                      : "border-slate-300"
                  }`}>
                    {completedItems[item.id] && <CheckCircle className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${completedItems[item.id] ? "text-green-700 line-through" : "text-slate-700"}`}>
                      {item.task}
                    </p>
                    <p className="text-xs text-slate-400">{item.area}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Employee Notes */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="mb-2 font-semibold text-slate-900">Your Notes</h2>
          <textarea
            value={employeeNotes}
            onChange={(e) => setEmployeeNotes(e.target.value)}
            placeholder="Add any notes about this job..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Photos */}
        {job.status === "in_progress" && (
          <div className="mb-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <PhotoUpload
              photos={beforePhotos}
              onPhotosChange={setBeforePhotos}
              label="Before Photos"
              maxPhotos={5}
            />
            <PhotoUpload
              photos={afterPhotos}
              onPhotosChange={setAfterPhotos}
              label="After Photos"
              maxPhotos={5}
            />
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-4">
        {job.status === "assigned" && (
          <div className="space-y-2">
            {job.customer_phone && (
              <button
                onClick={handleNotifyEnRoute}
                disabled={notifying || enRouteSent}
                className="w-full rounded-xl border border-teal-600 py-3 font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-50"
              >
                {enRouteSent ? "Customer Notified ✓" : notifying ? "Sending..." : "Notify Customer: On My Way"}
              </button>
            )}
            <button
              onClick={handleCheckIn}
              disabled={saving}
              className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? "Starting..." : "Check In - Start Job"}
            </button>
          </div>
        )}
        {job.status === "in_progress" && (
          <button
            onClick={handleCheckOut}
            disabled={saving}
            className="w-full rounded-xl bg-green-600 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Completing..." : "Check Out - Complete Job"}
          </button>
        )}
        {job.status === "completed" && (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-1 h-6 w-6 text-green-500" />
            <p className="text-sm font-medium text-green-700">Job Completed</p>
            {job.check_out_time && (
              <p className="text-xs text-slate-500">
                Completed at {new Date(job.check_out_time).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
