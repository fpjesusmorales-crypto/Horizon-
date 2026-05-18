import Link from "next/link"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book" },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <rect x="1.5" y="1.5" width="37" height="37" rx="4" stroke="url(#logoGradientFooter)" strokeWidth="2" fill="none" />
              <text x="20" y="26" textAnchor="middle" fill="url(#logoGradientFooter)" fontSize="18" fontWeight="600" fontFamily="system-ui, sans-serif">H</text>
            </svg>
            <div>
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-xs font-semibold tracking-[0.25em] text-transparent">HORIZON</div>
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-[10px] tracking-[0.2em] text-transparent">OPERATIONS</div>
            </div>
          </Link>
          <p className="mt-3 max-w-md text-sm text-slate-500">
            Residential cleaning built on reliability, clear communication, and consistent results.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            <a
              href="mailto:Jesusmorales@horizonoperations.cleaning"
              className="hover:text-teal-600 transition"
            >
              Jesusmorales@horizonoperations.cleaning
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-slate-600 md:items-end">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Horizon Operations LLC. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
