import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '@arach/devbar Documentation', 
  description: 'Documentation for @arach/devbar - Beautiful development toolbar for React',
  // Cache bust: 2025-08-18-v2
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}