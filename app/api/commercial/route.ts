import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const serviceTypeLabels: Record<string, string> = {
  office: "Office Cleaning",
  retail: "Retail Spaces",
  apartment: "Apartment Buildings / Multifamily",
  construction: "Construction Cleanup",
  medical: "Medical Offices",
}

const frequencyLabels: Record<string, string> = {
  daily: "Daily",
  threeWeekly: "3x Weekly",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      businessName, 
      contactName, 
      email, 
      phone, 
      serviceType, 
      squareFootage, 
      frequency, 
      restrooms,
      floors,
      startDate,
      message,
      estimatedRange 
    } = body

    if (!businessName || !contactName || !email || !phone || !serviceType || !frequency || !squareFootage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send notification to business owner
    const { error } = await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["bookings@horizonoperations.cleaning"],
      subject: `New Commercial Quote Request from ${businessName}`,
      html: `
        <h2>New Commercial Cleaning Quote Request</h2>
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 18px; font-weight: 600; color: #166534;">Estimated Monthly Range: ${estimatedRange}</p>
        </div>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p><strong>Service Type:</strong> ${serviceTypeLabels[serviceType] || serviceType}</p>
        <p><strong>Square Footage:</strong> ${squareFootage}</p>
        <p><strong>Cleaning Frequency:</strong> ${frequencyLabels[frequency] || frequency}</p>
        <p><strong>Number of Restrooms:</strong> ${restrooms || "Not provided"}</p>
        <p><strong>Number of Floors:</strong> ${floors || "Not provided"}</p>
        <p><strong>Desired Start Date:</strong> ${startDate || "Not provided"}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p><strong>Message / Notes:</strong></p>
        <p>${message || "No additional details provided"}</p>
        ${serviceType === "construction" ? '<p style="color: #b45309; font-weight: 600;">⚠️ Construction Cleanup - Site walkthrough recommended</p>' : ""}
        ${serviceType === "medical" ? '<p style="color: #1d4ed8; font-weight: 600;">🏥 Medical Office - Enhanced sanitation protocols may apply</p>' : ""}
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
            <h3 style="color: #0f172a; margin-top: 0;">Your Request Summary:</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Service Type:</strong> ${serviceTypeLabels[serviceType] || serviceType}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Square Footage:</strong> ${squareFootage}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Frequency:</strong> ${frequencyLabels[frequency] || frequency}</p>
            <p style="color: #0d9488; margin: 12px 0 0 0; font-weight: 600;">Estimated Monthly Range: ${estimatedRange}</p>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
            This is a preliminary estimate. Final pricing may vary after walkthrough, facility condition review, frequency requirements, and scope of work.
          </p>
          <p style="color: #475569; line-height: 1.6; margin-top: 20px;">
            If you have any questions in the meantime, feel free to reply to this email or reach us at 
            <a href="mailto:bookings@horizonoperations.cleaning" style="color: #0d9488;">bookings@horizonoperations.cleaning</a>.
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
