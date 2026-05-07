import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Budget Buddy',
  description: 'Beheer je inkomsten en uitgaven eenvoudig en overzichtelijk',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="bg-black text-white text-center py-4 text-sm mt-auto">
          <p>© 2025 Budget Buddy — Stichting KlikJongeren</p>
        </footer>
      </body>
    </html>
  )
}
