import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StackScout',
  description:
    'Discover the right architecture and open-source tools for what you want to build.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
