import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const body = await request.json()
    const {
      name,
      phone,
      email,
      city,
      hasTransportation,
      hasExperience,
      availability,
      message,
    } = body

    if (!name || !phone || !email || !city || !hasTransportation || !hasExperience || !availability) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send notification to Horizon Operations
    const { error } = await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["contact@horizonoperations.cleaning"],
      subject: `New Job Application from ${name}`,
      html: `
        <h2>New Job Application</h2>
        <p>A new applicant has submitted their information for the Residential Cleaning Team Member position.</p>
        
        <h3>Applicant Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Reliable Transportation:</strong> ${hasTransportation === "yes" ? "Yes" : "No"}</p>
        <p><strong>Prior Cleaning Experience:</strong> ${hasExperience === "yes" ? "Yes" : "No"}</p>
        <p><strong>Availability:</strong> ${availability}</p>
        ${message ? `<p><strong>Additional Message:</strong></p><p>${message}</p>` : ""}
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send application" }, { status: 500 })
    }

    // Send confirmation email to applicant
    await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: [email],
      subject: "Application Received - Horizon Operations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Thank you for your interest in joining Horizon Operations!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We have received your application for the Residential Cleaning Team Member position. Our team will review your information and contact qualified applicants as opportunities become available.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">What&apos;s Next?</h3>
            <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
              <li>We&apos;ll review your application</li>
              <li>If your qualifications match our current needs, we&apos;ll reach out to schedule a conversation</li>
              <li>We keep all applications on file for future opportunities</li>
            </ul>
          </div>
          <p style="color: #475569; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reach us at 
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
    console.error("Error processing application:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
