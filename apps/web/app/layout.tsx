import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'kreatr.app - AI-Powered Social Media Lab',
  description: 'Platform AI untuk kreator konten, marketer, dan UMKM. Generate ide, buat konten, dan schedule posting otomatis.',
  keywords: ['AI', 'social media', 'content creator', 'TikTok', 'Instagram', 'marketing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
