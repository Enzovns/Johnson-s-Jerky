'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠', exact: true },
  { href: '/admin/products', label: 'Products', icon: '🥩', exact: false },
  { href: '/admin/orders', label: 'Orders', icon: '📦', exact: false },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', exact: false },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-52 min-h-[calc(100vh-57px)] bg-leather/80 border-r border-terra/20 flex-shrink-0">
      <nav className="p-4 space-y-1">
        {navItems.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 font-body text-sm uppercase tracking-wider transition-all',
                active
                  ? 'bg-terra/30 text-gold border-l-2 border-gold'
                  : 'text-sand/60 hover:text-sand hover:bg-white/5 border-l-2 border-transparent'
              )}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
