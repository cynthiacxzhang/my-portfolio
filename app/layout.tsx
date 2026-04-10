import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cynthia Zhang',
  description: 'Neural graph portfolio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ width: '100%', height: '100%', background: '#060606', overflow: 'hidden' }}>
      <body style={{ margin: 0, padding: 0, width: '100%', height: '100%', background: '#060606', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
