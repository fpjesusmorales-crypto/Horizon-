"use server"

import { createClient } from "@/lib/supabase/server"

function generateCode(seed: string): string {
  // Build a short, readable code from the user's email/name plus randomness
  const prefix = seed.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "REF"
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}${random}`
}

export async function getOrCreateReferralAccount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Check for an existing account
  const { data: existing } = await supabase
    .from("referral_accounts")
    .select("referral_code, credit_balance")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    return { code: existing.referral_code, balance: Number(existing.credit_balance) }
  }

  // Create a new account with a unique code
  let code = generateCode(user.email || "")
  let attempts = 0
  while (attempts < 5) {
    const { error } = await supabase
      .from("referral_accounts")
      .insert({ user_id: user.id, referral_code: code })

    if (!error) {
      return { code, balance: 0 }
    }
    // Collision on unique code — regenerate and retry
    code = generateCode(user.email || "")
    attempts++
  }

  return { error: "Could not generate referral code" }
}

export async function sendReferral(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const email = String(formData.get("email") || "").trim().toLowerCase()
  const name = String(formData.get("name") || "").trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  const { error } = await supabase.from("referrals").insert({
    referrer_user_id: user.id,
    referred_email: email,
    referred_name: name || null,
  })

  if (error) {
    return { error: "Could not save referral. You may have already referred this email." }
  }

  return { success: true }
}
