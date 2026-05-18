import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const serviceTypeLabels: Record<string, string> = {
  office: "Office Cleaning",
  retail: "Retail Spaces",
  apartment: "Apartment Buildings",
  construction: "Construction Cleanup",
  medical: "Medical Offices",
}

const frequencyLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  monthly: "Monthly",
  onetime: "One-Time",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, contactName, email, phone, serviceType, squareFootage, frequency, message } = body

    if (!businessName || !contactName || !email || !phone || !serviceType || !frequency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send notification to business owner
    const { error } = await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["Jesusmorales@horizonoperations.cleaning"],
      subject: `New Commercial Quote Request from ${businessName}`,
      html: `
        <h2>New Commercial Cleaning Quote Request</h2>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceTypeLabels[serviceType] || serviceType}</p>
        <p><strong>Square Footage:</strong> ${squareFootage || "Not provided"}</p>
        <p><strong>Desired Frequency:</strong> ${frequencyLabels[frequency] || frequency}</p>
        <p><strong>Additional Details:</strong></p>
        <p>${message || "No additional details provided"}</p>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: [email],
      subject: "We received your commercial quote request - Horizon Operations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Thank you for your commercial cleaning inquiry!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${contactName},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We have received your commercial cleaning quote request for <strong>${businessName}</strong> and will review it promptly. 
            You can expect to hear back from us within 24-48 hours with a customized quote.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Your Request Details:</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Service Type:</strong> ${serviceTypeLabels[serviceType] || serviceType}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Frequency:</strong> ${frequencyLabels[frequency] || frequency}</p>
            ${squareFootage ? `<p style="color: #475569; margin: 8px 0;"><strong>Square Footage:</strong> ${squareFootage}</p>` : ""}
          </div>
          <p style="color: #475569; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reply to this email or reach us at 
            <a href="mailto:Jesusmorales@horizonoperations.cleaning" style="color: #0d9488;">Jesusmorales@horizonoperations.cleaning</a>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We look forward to serving your business!
          </p>
          <p style="color: #0f172a; font-weight: 600;">
            — The Horizon Operations Team
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing commercial quote request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
