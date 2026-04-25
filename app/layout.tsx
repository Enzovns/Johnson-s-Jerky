import type { Metadata } from 'next'
import { Rye, Special_Elite } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartProvider'

const rye = Rye({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-western',
  display: 'swap',
})

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Johnson's Jerky — Premium Beef Jerky & Biltong | Kalgoorlie WA",
  description:
    "Hand-crafted beef jerky and biltong from the heart of the Australian Outback. Delivering across Kalgoorlie, Boulder and surrounds.",
  keywords: ['jerky', 'biltong', 'Kalgoorlie', 'Western Australia', 'beef jerky', 'outback'],
  openGraph: {
    title: "Johnson's Jerky",
    description: 'Premium Beef Jerky & Biltong from Kalgoorlie, WA',
    siteName: "Johnson's Jerky",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rye.variable} ${specialElite.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
