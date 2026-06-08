"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Check, Trash2, Clock, Briefcase, AlertTriangle, Info } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  link: string | null
  read: boolean
  created_at: string
}

const typeIcons: Record<string, React.ReactNode> = {
  job_assigned: <Briefcase className="h-4 w-4 text-blue-500" />,
  job_updated: <Info className="h-4 w-4 text-teal-500" />,
  job_reminder: <Clock className="h-4 w-4 text-amber-500" />,
  alert: <AlertTriangle className="h-4 w-4 text-red-500" />,
  system: <Info className="h-4 w-4 text-slate-500" />,
}

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    fetchNotifications()

    // Subscribe to real-time notifications
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function fetchNotifications() {
    setLoading(true)
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setNotifications(data)
    setLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id)
    if (unreadIds.length === 0) return
    
    await supabase.from("notifications").update({ read: true }).in("id", unreadIds)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  async function deleteNotification(id: string) {
    await supabase.from("notifications").delete().eq("id", id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative border-b border-slate-100 last:border-b-0 ${
                    !notification.read ? "bg-teal-50/50" : ""
                  }`}
                >
                  {notification.link ? (
                    <Link
                      href={notification.link}
                      onClick={() => {
                        markAsRead(notification.id)
                        setOpen(false)
                      }}
                      className="block p-4 hover:bg-slate-50"
                    >
                      <NotificationContent notification={notification} formatTime={formatTime} />
                    </Link>
                  ) : (
                    <div className="p-4">
                      <NotificationContent notification={notification} formatTime={formatTime} />
                    </div>
                  )}
                  
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-teal-600"
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 p-2">
            <Link
              href="/ops/admin/notifications"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm text-slate-600 hover:bg-slate-50"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationContent({
  notification,
  formatTime,
}: {
  notification: Notification
  formatTime: (date: string) => string
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{typeIcons[notification.type] || typeIcons.system}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{notification.title}</p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{notification.message}</p>
        <p className="mt-1 text-xs text-slate-400">{formatTime(notification.created_at)}</p>
      </div>
    </div>
  )
}
