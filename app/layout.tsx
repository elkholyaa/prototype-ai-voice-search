import type { Metadata } from 'next'
import { Noto_Kufi_Arabic } from 'next/font/google'
import './globals.css'

const arabic = Noto_Kufi_Arabic({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'بحث العقارات',
  description: 'البحث في العقارات المتاحة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={arabic.className}>{children}</body>
    </html>
  )
} 