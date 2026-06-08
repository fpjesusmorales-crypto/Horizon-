import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS, smsTemplates } from "@/lib/sms"

// POST /api/ops/sms - send a status SMS to a customer for a work order
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify the requester is an authenticated employee
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: employee } = await supabase
      .from("employees")
      .select("id, role")
      .eq("user_id", user.id)
      .single()

    if (!employee) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { workOrderId, type, eta } = await request.json()

    if (!workOrderId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch the work order details
    const { data: workOrder, error: woError } = await supabase
      .from("work_orders")
      .select("customer_name, customer_phone")
      .eq("id", workOrderId)
      .single()

    if (woError || !workOrder) {
      return NextResponse.json({ error: "Work order not found" }, { status: 404 })
    }

    if (!workOrder.customer_phone) {
      return NextResponse.json({ error: "No customer phone on file" }, { status: 400 })
    }

    const firstName = workOrder.customer_name?.split(" ")[0] || "there"

    let message: string
    switch (type) {
      case "en_route":
        message = smsTemplates.cleanerEnRoute(firstName, eta || "shortly")
        break
      case "started":
        message = smsTemplates.cleaningStarted(firstName)
        break
      case "complete":
        message = smsTemplates.cleaningComplete(firstName)
        break
      default:
        return NextResponse.json({ error: "Invalid SMS type" }, { status: 400 })
    }

    const result = await sendSMS(workOrder.customer_phone, message)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send SMS" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] SMS API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
