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
      from: "Horizon Operations <onboarding@resend.dev>",
      to: ["Jesusmorales@horizonoperations.cleaning"],
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

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
