'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SheriffStarIcon } from '@/components/decorations'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-leather border-b-4 border-terra shadow-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-terra/30 border border-gold/30 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="Johnson's Jerky"
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <SheriffStarIcon className="w-6 h-6 text-gold absolute" />
            </div>
            <div>
              <span className="font-western text-xl md:text-2xl text-gold tracking-widest group-hover:text-sand transition-colors">
                Johnson&apos;s
              </span>
              <span className="block font-body text-xs text-sand/60 tracking-[0.2em] uppercase -mt-1">
                Jerky & Biltong
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="font-body text-sm uppercase tracking-widest text-sand/80 hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/products" className="font-body text-sm uppercase tracking-widest text-sand/80 hover:text-gold transition-colors">
              Products
            </Link>
            <Link href="/#about" className="font-body text-sm uppercase tracking-widest text-sand/80 hover:text-gold transition-colors">
              Our Story
            </Link>
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-sand hover:text-gold transition-colors"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-terra/30 py-4 flex flex-col gap-3">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/#about', label: 'Our Story' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm uppercase tracking-widest text-sand/80 hover:text-gold px-2 py-1 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
