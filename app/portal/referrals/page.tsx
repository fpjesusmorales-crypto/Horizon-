import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReferralDashboard } from "@/components/referral-dashboard"
import { getOrCreateReferralAccount } from "@/app/actions/referrals"

export const metadata = {
  title: "Refer a Friend | Horizon Operations",
  description: "Refer friends and earn cleaning credits",
}

export default async function ReferralsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const account = await getOrCreateReferralAccount()

  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, referred_email, referred_name, status, reward_amount, created_at")
    .eq("referrer_user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Refer a Friend, Get $25</h1>
            <p className="mt-2 text-slate-600">
              Give your friends $25 off their first cleaning. When they book, you get $25 in credit too.
            </p>
          </div>

          {account.error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              {account.error}
            </div>
          ) : (
            <ReferralDashboard
              referralCode={account.code!}
              creditBalance={account.balance!}
              referrals={referrals || []}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
