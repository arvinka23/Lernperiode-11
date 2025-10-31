import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Parkly - Kostenlose Parkplatz-Finder App',
  description: 'Finde kostenlose Parkplätze mit der Community - Crowdsourcing-basiert und kostenlos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}

