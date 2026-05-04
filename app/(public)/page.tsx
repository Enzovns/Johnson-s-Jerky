import Link from 'next/link'
import Image from 'next/image'
import { fetchProducts } from '@/lib/airtable/client'
import { formatPrice } from '@/lib/utils/format'
import {
  HeadframeIcon,
  KangarooIcon,
  GuitarIcon,
  SheriffStarIcon,
} from '@/components/decorations'
import type { Product } from '@/lib/airtable/types'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const all = await fetchProducts()
    return all.filter(p => p.available).slice(0, 4)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen overflow-hidden gradient-sunset flex items-center">
        {/* Floating dust */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`dust-particle animate-dust-${i + 1}`}
              style={{ bottom: `${15 + i * 8}%`, left: `${10 + i * 15}%` }}
            />
          ))}
        </div>

        {/* Headframe silhouette */}
        <div className="absolute right-0 bottom-0 w-2/5 md:w-1/3 h-[85%] opacity-15 text-charcoal pointer-events-none">
          <HeadframeIcon className="w-full h-full" />
        </div>

        {/* Kangaroo silhouette */}
        <div className="absolute left-4 md:left-12 bottom-16 w-24 md:w-40 opacity-20 text-sand animate-float-slow pointer-events-none">
          <KangarooIcon className="w-full h-full" />
        </div>

        {/* Guitar decoration */}
        <div className="absolute right-6 md:right-16 bottom-4 w-10 md:w-16 opacity-30 text-gold animate-sway pointer-events-none">
          <GuitarIcon className="w-full h-full" />
        </div>

        {/* Ground gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-leather/80 to-transparent" />

        {/* Main content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24">
          <div className="flex justify-center items-center gap-6 mb-8">
            <SheriffStarIcon className="w-6 h-6 text-gold/50" />
            <div className="h-px w-16 bg-gold/30" />
            <SheriffStarIcon className="w-10 h-10 text-gold animate-float-slow" />
            <div className="h-px w-16 bg-gold/30" />
            <SheriffStarIcon className="w-6 h-6 text-gold/50" />
          </div>

          <h1 className="font-western text-6xl sm:text-7xl md:text-9xl text-gold text-western-shadow mb-2 leading-none">
            JOHNSON&apos;S
          </h1>
          <h2 className="font-western text-4xl sm:text-5xl md:text-7xl text-sand text-western-shadow-light mb-6 leading-none tracking-widest">
            JERKY
          </h2>

          <div className="divider-western max-w-sm mx-auto mb-6">
            <span className="font-western text-gold text-xl">★</span>
          </div>

          <p className="font-body text-sand/80 text-lg md:text-xl max-w-xl mx-auto mb-4 leading-relaxed">
            Premium Beef Jerky & Biltong
          </p>
          <p className="font-body text-sand/50 text-sm md:text-base tracking-widest uppercase mb-10">
            Forged in the red dust of Kalgoorlie, WA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-stamp px-10 py-4 text-base inline-block hover:no-underline">
              🤠 Shop Now
            </Link>
            <Link
              href="#about"
              className="font-body font-bold uppercase tracking-widest text-sand/80 border-2 border-sand/30 px-10 py-4 hover:bg-sand/10 hover:text-gold hover:border-gold/50 transition-all text-base inline-block"
            >
              Our Story
            </Link>
          </div>

          <div className="mt-10 inline-flex items-center gap-2 bg-leather/60 border border-gold/20 px-4 py-2">
            <span className="text-gold text-sm">🚚</span>
            <span className="font-body text-xs text-sand/60 tracking-widest uppercase">
              Local delivery — Kalgoorlie & surrounds
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-dark-terra via-terra to-dark-terra opacity-60" />
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="section-leather py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="wanted-badge text-gold/60 block mb-2">— Est. Kalgoorlie, WA —</p>
            <h2 className="font-western text-4xl md:text-5xl text-gold text-western-shadow-light mb-4">
              Our Finest Cuts
            </h2>
            <div className="divider-western max-w-xs mx-auto">
              <SheriffStarIcon className="w-5 h-5" />
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {DEMO_PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-stamp px-10 py-3 text-sm inline-block hover:no-underline">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== ABOUT ========== */}
      <section id="about" className="section-parchment py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-5 text-leather pointer-events-none">
          <HeadframeIcon className="w-full h-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <p className="wanted-badge text-terra block mb-2">— The Story —</p>
            <h2 className="font-western text-4xl md:text-5xl text-leather text-western-shadow-light mb-4">
              Born in the Outback
            </h2>
            <div className="divider-western max-w-xs mx-auto text-terra">
              <SheriffStarIcon className="w-5 h-5 text-terra" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 font-body text-dark-leather leading-relaxed">
              <p>
                Out here in Kalgoorlie, where the red earth meets a sky wide enough to swallow
                your troubles whole, Johnson started making jerky the old way — no shortcuts,
                no nonsense. Just quality cuts, honest spices, and the dry Outback air doing
                the rest.
              </p>
              <p>
                Every batch is crafted with the same grit that built this mining town.
                Whether you&apos;re heading down the shaft, cracking open a cold one at the
                Boulder Bar, or just making it through another scorcher — Johnson&apos;s
                Jerky has your back.
              </p>
              <p className="font-western text-terra text-lg">
                &quot;Dried slow, seasoned right, made for the road.&quot;
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-4 items-end">
                <GuitarIcon className="w-16 text-terra/60" />
                <KangarooIcon className="w-20 h-24 text-terra/50" />
              </div>
              <div className="wanted-card text-center p-6 max-w-xs">
                <p className="wanted-badge text-dark-terra block mb-3">Free Delivery</p>
                <p className="font-western text-2xl text-leather mb-2">On orders over $50</p>
                <p className="font-body text-sm text-dark-leather">Within Kalgoorlie & Boulder area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DELIVERY ========== */}
      <section className="bg-terra py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Standard Delivery', sub: '3-5 business days', desc: 'Kalgoorlie & surrounds' },
              { icon: '⚡', title: 'Express Delivery', sub: '1-2 business days', desc: 'Get it fast, cowboy' },
              { icon: '📍', title: 'Local Only', sub: 'Postcodes 6430–6438', desc: 'Keeping it in the goldfields' },
            ].map(({ icon, title, sub, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-western text-xl text-parchment tracking-wide">{title}</h3>
                <p className="font-body text-sm text-sand font-bold">{sub}</p>
                <p className="font-body text-xs text-parchment/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProductCard({ product }: { product: Product }) {
  const soldOut = !product.available

  return (
    <article className={`wanted-card flex flex-col ${soldOut ? 'opacity-60' : 'hover:scale-[1.02] transition-transform duration-200'}`}>
      <p className="wanted-badge text-center text-dark-terra border-b border-dark-terra/20 pb-2 mb-3">
        ★ WANTED ★
      </p>

      <Link href={`/products/${product.id}`} className="block relative w-full aspect-square mb-3 overflow-hidden bg-sand/50">
        <Image
          src={product.image_url || `https://placehold.co/400x400/B85C38/F5E6D3?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {soldOut && (
          <div className="absolute inset-0 bg-leather/60 flex items-center justify-center">
            <span className="font-western text-2xl text-parchment transform -rotate-12 border-4 border-parchment px-4 py-2">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-western text-lg text-leather leading-tight hover:text-terra transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="font-body text-xs text-terra/70 uppercase tracking-widest mb-1">{product.category}</p>
        )}
        <p className="font-body text-xs text-dark-leather/70 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-western text-2xl text-terra">
            {formatPrice(product.price_cents)}
          </span>
          {soldOut ? (
            <span className="font-body text-xs text-red-600 uppercase tracking-widest">Sold Out</span>
          ) : product.stripe_payment_link ? (
            <a
              href={product.stripe_payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stamp px-3 py-1.5 text-xs hover:no-underline"
            >
              Order
            </a>
          ) : (
            <Link href={`/products/${product.id}`} className="btn-stamp px-3 py-1.5 text-xs hover:no-underline">
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    name: 'Outback Beef Jerky — Original',
    description: 'Slow-dried premium beef with classic outback seasoning. Simple, bold, and unforgettable.',
    price_cents: 1800,
    image_url: 'https://placehold.co/400x400/B85C38/F5E6D3?text=Outback+Jerky',
    category: 'Jerky',
    available: true,
    stripe_payment_link: null,
  },
  {
    id: 'demo-2',
    name: 'Roo Biltong',
    description: "Kangaroo dried with traditional bush spices. Lean, rich, and uniquely Australian.",
    price_cents: 2200,
    image_url: 'https://placehold.co/400x400/8B3A1F/E8D5B7?text=Roo+Biltong',
    category: 'Biltong',
    available: true,
    stripe_payment_link: null,
  },
  {
    id: 'demo-3',
    name: 'Smoky Bushranger Jerky',
    description: 'Smoked beef with cracked pepper and roasted garlic. For those who ride hard and eat harder.',
    price_cents: 2500,
    image_url: 'https://placehold.co/400x400/3E2723/C9A961?text=Bushranger',
    category: 'Jerky',
    available: true,
    stripe_payment_link: null,
  },
  {
    id: 'demo-4',
    name: 'Spicy Desert Strips',
    description: 'Chilli and paprika-crusted beef strips with a slow Outback heat that sneaks up on you.',
    price_cents: 1900,
    image_url: 'https://placehold.co/400x400/C9A961/3E2723?text=Spicy+Desert',
    category: 'Jerky',
    available: true,
    stripe_payment_link: null,
  },
]
