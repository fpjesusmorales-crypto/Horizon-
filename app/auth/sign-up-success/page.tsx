import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
              <svg className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Check Your Email</h1>
            <p className="mt-4 text-slate-600">
              We&apos;ve sent a confirmation link to your email address. Please click the link to verify your account and complete your registration.
            </p>
            <div className="mt-8">
              <Link
                href="/auth/login"
                className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
