import { Resend } from "resend"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendSMS, smsTemplates } from "@/lib/sms"

const SERVICE_LABELS: Record<string, string> = {
  standard: "Standard Cleaning",
  deep: "Deep Cleaning",
  move: "Move-In / Move-Out Cleaning",
}

const FREQUENCY_LABELS: Record<string, string> = {
  "one-time": "One-Time",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
}

export async function POST(request: Request) {
  try {
  const resend = new Resend(process.env.RESEND_API_KEY)
  // Create admin Supabase client for server-side operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const {
      service,
      frequency,
      preferredDate,
      preferredTime,
      alternateDate,
      squareFeet,
      bedrooms,
      bathrooms,
      specialInstructions,
      name,
      email,
      phone,
      address,
    } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !service || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format the date nicely
    const formattedDate = new Date(preferredDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formattedAltDate = alternateDate
      ? new Date(alternateDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null

    // Send notification to business owner
    const { error } = await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: ["bookings@horizonoperations.cleaning"],
      subject: `New Booking Request from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">New Booking Request</h2>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Service Details</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Service:</strong> ${SERVICE_LABELS[service] || service}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Frequency:</strong> ${FREQUENCY_LABELS[frequency] || frequency}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Preferred Date:</strong> ${formattedDate}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Preferred Time:</strong> ${preferredTime}</p>
            ${formattedAltDate ? `<p style="color: #475569; margin: 8px 0;"><strong>Alternate Date:</strong> ${formattedAltDate}</p>` : ""}
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Home Details</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Square Feet:</strong> ${squareFeet || "Not provided"}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Bedrooms:</strong> ${bedrooms || "Not provided"}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Bathrooms:</strong> ${bathrooms || "Not provided"}</p>
            ${specialInstructions ? `<p style="color: #475569; margin: 8px 0;"><strong>Special Instructions:</strong> ${specialInstructions}</p>` : ""}
          </div>

          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Contact Information</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Address:</strong> ${address || "Not provided"}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send booking request" }, { status: 500 })
    }

    // Create work order in database for ops dashboard
    try {
      // Map service type to work_orders service_type
      const serviceTypeMap: Record<string, string> = {
        standard: "standard",
        deep: "deep",
        move: "move",
      }

      // Get home size description
      const homeSize = squareFeet 
        ? `${squareFeet} sq ft, ${bedrooms || 0} bed, ${bathrooms || 0} bath`
        : `${bedrooms || 0} bed, ${bathrooms || 0} bath`

      const { error: workOrderError } = await supabaseAdmin
        .from("work_orders")
        .insert({
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          address: address || "Address pending",
          city: "Nashville", // Default city, can be parsed from address
          service_type: serviceTypeMap[service] || service,
          scheduled_date: preferredDate,
          scheduled_time: preferredTime,
          status: "pending",
          notes: [
            `Frequency: ${FREQUENCY_LABELS[frequency] || frequency}`,
            `Home size: ${homeSize}`,
            specialInstructions ? `Special instructions: ${specialInstructions}` : null,
            formattedAltDate ? `Alternate date requested: ${formattedAltDate}` : null,
          ].filter(Boolean).join("\n"),
        })

      if (workOrderError) {
        console.error("Work order creation error:", workOrderError)
        // Don't fail the whole request if work order creation fails
      }
    } catch (workOrderErr) {
      console.error("Work order creation exception:", workOrderErr)
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: "Horizon Operations <noreply@horizonoperations.cleaning>",
      to: [email],
      subject: "Booking Request Received - Horizon Operations",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Thank you for your booking request!</h2>
          <p style="color: #475569; line-height: 1.6;">
            Hi ${name},
          </p>
          <p style="color: #475569; line-height: 1.6;">
            We&apos;ve received your cleaning request and will confirm your appointment within 24 hours.
          </p>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="color: #0f172a; margin-top: 0;">Your Request Summary</h3>
            <p style="color: #475569; margin: 8px 0;"><strong>Service:</strong> ${SERVICE_LABELS[service] || service}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Frequency:</strong> ${FREQUENCY_LABELS[frequency] || frequency}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Requested Date:</strong> ${formattedDate}</p>
            <p style="color: #475569; margin: 8px 0;"><strong>Requested Time:</strong> ${preferredTime}</p>
            ${address ? `<p style="color: #475569; margin: 8px 0;"><strong>Address:</strong> ${address}</p>` : ""}
          </div>
          
          <p style="color: #475569; line-height: 1.6;">
            <strong>What happens next?</strong><br>
            We'll review your request and check our availability. You'll receive a confirmation email 
            with your final appointment details, or we'll reach out if we need to discuss alternative times.
          </p>
          
          <p style="color: #475569; line-height: 1.6;">
            If you have any questions, feel free to reply to this email or contact us at 
            <a href="mailto:bookings@horizonoperations.cleaning" style="color: #0d9488;">bookings@horizonoperations.cleaning</a>.
          </p>
          
          <p style="color: #0f172a; font-weight: 600;">
            — The Horizon Operations Team
          </p>
        </div>
      `,
    })

    // Send SMS confirmation to customer (fire-and-forget)
    try {
      await sendSMS(phone, smsTemplates.bookingConfirmation(name, formattedDate))
    } catch (smsErr) {
      console.error("[v0] Booking SMS error:", smsErr)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Booking form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
