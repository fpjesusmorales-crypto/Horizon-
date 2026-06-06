import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

const client = accountSid && authToken ? twilio(accountSid, authToken) : null

/**
 * Formats a phone number to E.164 format (e.g. +16155551234).
 * Assumes US numbers if no country code is present.
 */
function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) {
    return `+1${digits}`
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }
  if (phone.startsWith("+")) {
    return phone
  }
  return null
}

/**
 * Sends an SMS message via Twilio.
 * Returns { success, error } and never throws so callers can fire-and-forget.
 */
export async function sendSMS(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  if (!client || !fromNumber) {
    console.error("[v0] Twilio not configured - missing credentials")
    return { success: false, error: "SMS service not configured" }
  }

  const formattedTo = formatPhoneNumber(to)
  if (!formattedTo) {
    console.error("[v0] Invalid phone number:", to)
    return { success: false, error: "Invalid phone number" }
  }

  try {
    await client.messages.create({
      body,
      from: fromNumber,
      to: formattedTo,
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] Twilio SMS error:", message)
    return { success: false, error: message }
  }
}

/**
 * Pre-built SMS templates for common cleaning operations events.
 */
export const smsTemplates = {
  bookingConfirmation: (name: string, date: string) =>
    `Hi ${name}, your Horizon Operations cleaning is confirmed for ${date}. We'll send a reminder before your appointment. Reply STOP to opt out.`,

  appointmentReminder: (name: string, date: string, time: string) =>
    `Reminder: Your Horizon Operations cleaning is scheduled for ${date} at ${time}. See you soon!`,

  cleanerEnRoute: (name: string, eta: string) =>
    `Hi ${name}, your Horizon cleaner is on the way! Estimated arrival: ${eta}.`,

  cleaningStarted: (name: string) =>
    `Hi ${name}, your Horizon cleaner has arrived and started your cleaning. We'll notify you when it's complete.`,

  cleaningComplete: (name: string) =>
    `Hi ${name}, your Horizon cleaning is complete! We'd love your feedback. Thank you for choosing Horizon Operations.`,

  jobAssigned: (employeeName: string, customerName: string, date: string, time: string) =>
    `Hi ${employeeName}, you've been assigned a new job: ${customerName} on ${date} at ${time}. Check the app for details.`,
}
