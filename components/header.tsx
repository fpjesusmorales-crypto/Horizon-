"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { LanguageToggle } from "./language-toggle"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const pathname = usePathname()
  const { t, locale } = useLanguage()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Check auth status
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/careers", label: t.nav.careers },
    { href: "/partnerships-growth", label: t.nav.partnerships },
    { href: "/contact", label: t.nav.contact },
  ]

  const serviceLinks = [
    { 
      href: "/services", 
      label: t.nav.residential,
      description: locale === "es" ? "Limpieza de hogares" : "Home cleaning services"
    },
    { 
      href: "/commercial", 
      label: t.nav.commercial,
      description: locale === "es" ? "Oficinas y negocios" : "Office & business cleaning"
    },
  ]

  const isServicesActive = pathname === "/services" || pathname === "/commercial"

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <rect x="1.5" y="1.5" width="37" height="37" rx="4" stroke="url(#logoGradientHeader)" strokeWidth="2" fill="none" />
            <text x="20" y="26" textAnchor="middle" fill="url(#logoGradientHeader)" fontSize="18" fontWeight="600" fontFamily="system-ui, sans-serif">H</text>
          </svg>
          <div>
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-sm font-semibold tracking-[0.28em] text-transparent">HORIZON</div>
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-xs tracking-[0.22em] text-transparent">OPERATIONS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`text-sm transition hover:text-slate-900 ${
              pathname === "/" ? "font-medium text-slate-900" : "text-slate-600"
            }`}
          >
            {t.nav.home}
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`flex items-center gap-1 text-sm transition hover:text-slate-900 ${
                isServicesActive ? "font-medium text-slate-900" : "text-slate-600"
              }`}
            >
              {t.nav.services}
              <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            {servicesOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-4 py-3 transition hover:bg-slate-50 ${
                      pathname === link.href ? "bg-slate-50" : ""
                    }`}
                    onClick={() => setServicesOpen(false)}
                  >
                    <div className={`text-sm font-medium ${pathname === link.href ? "text-teal-600" : "text-slate-900"}`}>
                      {link.label}
                    </div>
                    <div className="text-xs text-slate-500">{link.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition hover:text-slate-900 ${
                pathname === link.href ? "font-medium text-slate-900" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          {user ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <User className="h-4 w-4" />
              {locale === "es" ? "Mi Portal" : "My Portal"}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {locale === "es" ? "Iniciar Sesión" : "Sign In"}
            </Link>
          )}
          <Link
            href="/book"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5"
          >
            {t.nav.bookCleaning}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className={`text-sm transition hover:text-slate-900 ${
                pathname === "/" ? "font-medium text-slate-900" : "text-slate-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            
            {/* Mobile Services Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.nav.services}
              </div>
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block pl-4 text-sm transition hover:text-slate-900 ${
                    pathname === link.href ? "font-medium text-teal-600" : "text-slate-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition hover:text-slate-900 ${
                  pathname === link.href ? "font-medium text-slate-900" : "text-slate-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between">
              <LanguageToggle />
              {user ? (
                <Link
                  href="/portal"
                  className="flex items-center gap-2 text-sm font-medium text-teal-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {locale === "es" ? "Mi Portal" : "My Portal"}
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-teal-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {locale === "es" ? "Iniciar Sesión" : "Sign In"}
                </Link>
              )}
            </div>
            <Link
              href="/book"
              className="mt-2 rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.bookCleaning}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
