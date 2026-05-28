import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, company, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Send notification to Horizon Operations
    await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["contact@horizonoperations.cleaning"],
      subject: `Partnership Inquiry from ${name}${company ? ` (${company})` : ""}`,
      html: `
        <h2>New Partnership Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    // Send confirmation to the inquirer
    await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: [email],
      subject: "We received your inquiry - Horizon Operations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Thank you for reaching out to Horizon Operations!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We have received your partnership inquiry and appreciate your interest in Horizon Operations. 
            A member of our team will review your message and get back to you soon.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Your Inquiry:</h3>
            ${company ? `<p style="color: #475569; margin: 8px 0;"><strong>Company:</strong> ${company}</p>` : ""}
            <p style="color: #475569; margin: 8px 0;"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            If you have any additional questions, feel free to reply to this email or reach us at 
            <a href="mailto:contact@horizonoperations.cleaning" style="color: #0d9488;">contact@horizonoperations.cleaning</a>.
          </p>
          <p style="color: #0f172a; font-weight: 600;">
            — The Horizon Operations Team
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Partnership inquiry error:", error)
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 }
    )
  }
}
