import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function OpsAuthSignoutPage() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/ops/auth/login")
}
