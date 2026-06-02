import { createClient } from "@/lib/supabase/server"

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type: "job_assigned" | "job_updated" | "job_reminder" | "system" | "alert"
  link?: string
}

export async function createNotification(params: CreateNotificationParams) {
  const supabase = await createClient()
  
  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    title: params.title,
    message: params.message,
    type: params.type,
    link: params.link || null,
  })

  if (error) {
    console.error("Error creating notification:", error)
    return false
  }

  return true
}

export async function notifyJobAssigned(employeeUserId: string, jobId: string, customerName: string, scheduledDate: string) {
  return createNotification({
    userId: employeeUserId,
    title: "New Job Assigned",
    message: `You've been assigned a cleaning job for ${customerName} on ${new Date(scheduledDate).toLocaleDateString()}.`,
    type: "job_assigned",
    link: `/ops/employee/job/${jobId}`,
  })
}

export async function notifyJobUpdated(employeeUserId: string, jobId: string, customerName: string, change: string) {
  return createNotification({
    userId: employeeUserId,
    title: "Job Updated",
    message: `The job for ${customerName} has been updated: ${change}`,
    type: "job_updated",
    link: `/ops/employee/job/${jobId}`,
  })
}

export async function notifyJobReminder(employeeUserId: string, jobId: string, customerName: string, time: string) {
  return createNotification({
    userId: employeeUserId,
    title: "Upcoming Job Reminder",
    message: `Reminder: You have a job for ${customerName} at ${time} today.`,
    type: "job_reminder",
    link: `/ops/employee/job/${jobId}`,
  })
}
