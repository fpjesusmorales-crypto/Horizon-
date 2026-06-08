import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, phone, email, homeSize, service, message } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const serviceLabels: Record<string, string> = {
      standard: "Standard Cleaning",
      deep: "Deep Cleaning",
      move: "Move-In / Move-Out Cleaning",
    }

    const { data, error } = await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["contact@horizonoperations.cleaning"],
      subject: `New Cleaning Request from ${name}`,
      html: `
        <h2>New Cleaning Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Home Size:</strong> ${homeSize || "Not provided"}</p>
        <p><strong>Service:</strong> ${serviceLabels[service] || "Not selected"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No additional message"}</p>
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
      subject: "We received your cleaning request - Horizon Operations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Thank you for contacting Horizon Operations!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We have received your cleaning request and will get back to you as soon as possible, typically within 24 hours.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Your Request Details:</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Service:</strong> ${serviceLabels[service] || "Not selected"}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Home Size:</strong> ${homeSize || "Not provided"}</p>
            ${message ? `<p style="color: #475569; margin: 8px 0;"><strong>Message:</strong> ${message}</p>` : ""}
          </div>
          <p style="color: #475569; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reply to this email or reach us at 
            <a href="mailto:contact@horizonoperations.cleaning" style="color: #0d9488;">contact@horizonoperations.cleaning</a>.
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We look forward to serving you!
          </p>
          <p style="color: #0f172a; font-weight: 600;">
            — The Horizon Operations Team
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
