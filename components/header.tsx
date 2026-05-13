"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-3">
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
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm text-slate-600 transition hover:text-slate-900">Home</a>
          <a href="#services" className="text-sm text-slate-600 transition hover:text-slate-900">Services</a>
          <a href="#about" className="text-sm text-slate-600 transition hover:text-slate-900">About</a>
          <a href="#safety" className="text-sm text-slate-600 transition hover:text-slate-900">Safety</a>
          <a href="#contact" className="text-sm text-slate-600 transition hover:text-slate-900">Contact</a>
        </nav>

        <a
          href="#contact"
          className="hidden rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 md:inline-flex"
        >
          Book a Cleaning
        </a>

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
            <a href="#home" className="text-sm text-slate-600 transition hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#services" className="text-sm text-slate-600 transition hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#about" className="text-sm text-slate-600 transition hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#safety" className="text-sm text-slate-600 transition hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Safety</a>
            <a href="#contact" className="text-sm text-slate-600 transition hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a
              href="#contact"
              className="mt-2 rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book a Cleaning
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
