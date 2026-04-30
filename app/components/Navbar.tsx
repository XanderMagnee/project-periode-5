'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/persons', label: 'Personen' },
    { href: '/categories', label: 'Categorieën' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">💰</span>
          <span>Budget Buddy</span>
        </Link>
        <ul className="flex gap-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href || (href !== '/' && pathname.startsWith(href))
                    ? 'bg-blue-900'
                    : 'hover:bg-blue-600'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
