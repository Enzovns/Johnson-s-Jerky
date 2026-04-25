import Link from 'next/link'
import { SheriffStarIcon, KangarooIcon } from '@/components/decorations'

export default function Footer() {
  return (
    <footer className="bg-leather border-t-4 border-terra">
      {/* Bande décorative */}
      <div className="h-1 bg-gradient-to-r from-dark-terra via-gold to-dark-terra" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Colonne 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SheriffStarIcon className="w-8 h-8 text-gold" />
              <h3 className="font-western text-2xl text-gold tracking-widest">
                Johnson&apos;s Jerky
              </h3>
            </div>
            <p className="font-body text-sm text-sand/60 leading-relaxed">
              Premium beef jerky & biltong, crafted in the red dust of Kalgoorlie,
              Western Australia. Flavours as rugged as the Outback itself.
            </p>
            <div className="mt-4">
              <KangarooIcon className="w-12 h-14 text-terra/40" />
            </div>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <h4 className="font-western text-lg text-gold tracking-wider mb-4">
              Trail Map
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/#about', label: 'Our Story' },
                { href: '/cart', label: 'Your Wagon' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-body text-sm text-sand/60 hover:text-gold transition-colors tracking-wider"
                >
                  → {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Colonne 3 — Contact */}
          <div>
            <h4 className="font-western text-lg text-gold tracking-wider mb-4">
              Find Us
            </h4>
            <div className="font-body text-sm text-sand/60 space-y-2">
              <p>📍 Kalgoorlie, WA 6430</p>
              <p>🚚 Delivery: Kalgoorlie & surrounds</p>
              <p>⏰ Postcodes 6430–6438</p>
            </div>
            <div className="mt-6 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <SheriffStarIcon key={i} className="w-5 h-5 text-gold/30" />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-terra/30 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-sand/40 tracking-widest uppercase">
            © {new Date().getFullYear()} Johnson&apos;s Jerky — Kalgoorlie, WA
          </p>
          <p className="font-body text-xs text-sand/30 italic">
            &quot;Born in the dust, dried in the sun&quot;
          </p>
        </div>
      </div>
    </footer>
  )
}
