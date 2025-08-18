import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '@arach/devbar Documentation',
  description: 'Documentation for @arach/devbar - Beautiful development toolbar for React',
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