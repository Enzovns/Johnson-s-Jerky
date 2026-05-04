import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { fetchProductById } from '@/lib/airtable/client'
import { formatPrice } from '@/lib/utils/format'
import { SheriffStarIcon } from '@/components/decorations'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const product = await fetchProductById(params.id)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Johnson's Jerky`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProductById(params.id)
  if (!product) notFound()

  const soldOut = !product.available

  return (
    <div className="min-h-screen section-parchment">
      {/* Breadcrumb */}
      <div className="bg-leather/80 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="font-body text-xs text-sand/50 tracking-widest uppercase">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-sand/80">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Image */}
          <div className="wanted-card p-3">
            <p className="wanted-badge text-center text-dark-terra border-b border-dark-terra/20 pb-2 mb-3">
              ★ WANTED ★
            </p>
            <div className="relative aspect-square overflow-hidden bg-sand/30">
              <Image
                src={product.image_url || `https://placehold.co/600x600/B85C38/F5E6D3?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {soldOut && (
                <div className="absolute inset-0 bg-leather/60 flex items-center justify-center">
                  <span className="font-western text-3xl text-parchment transform -rotate-12 border-4 border-parchment px-6 py-3">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="py-2">
            <p className="wanted-badge text-terra block mb-2 tracking-[0.3em]">
              — Johnson&apos;s Jerky —
            </p>

            {product.category && (
              <p className="font-body text-xs text-terra/70 uppercase tracking-widest mb-2">{product.category}</p>
            )}

            <h1 className="font-western text-4xl md:text-5xl text-leather text-western-shadow-light leading-tight mb-4">
              {product.name}
            </h1>

            <div className="divider-western text-terra mb-6">
              <SheriffStarIcon className="w-4 h-4 text-terra" />
            </div>

            <div className="font-western text-4xl text-terra mb-6">
              {formatPrice(product.price_cents)}
            </div>

            <p className="font-body text-dark-leather leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Availability */}
            <div className="mb-6">
              {soldOut ? (
                <span className="font-body text-xs text-red-700 bg-red-100 border border-red-200 px-3 py-1 uppercase tracking-widest">
                  ✗ Out of Stock
                </span>
              ) : (
                <span className="font-body text-xs text-green-700 bg-green-100 border border-green-200 px-3 py-1 uppercase tracking-widest">
                  ✓ In Stock
                </span>
              )}
            </div>

            {/* Order button */}
            {soldOut ? (
              <button disabled className="btn-stamp w-full py-4 text-base opacity-50 cursor-not-allowed">
                Currently Unavailable
              </button>
            ) : product.stripe_payment_link ? (
              <a
                href={product.stripe_payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-stamp w-full py-4 text-base text-center block hover:no-underline"
              >
                🤠 Order Now →
              </a>
            ) : (
              <button disabled className="btn-stamp w-full py-4 text-base opacity-50 cursor-not-allowed" title="Order link not available">
                Order Link Coming Soon
              </button>
            )}

            {/* Delivery info */}
            <div className="mt-8 border border-terra/20 bg-terra/5 p-4">
              <p className="font-body text-xs text-dark-leather space-y-1">
                <span className="block">🚚 <strong>Standard delivery:</strong> 3–5 business days</span>
                <span className="block">⚡ <strong>Express delivery:</strong> 1–2 business days</span>
                <span className="block">📍 <strong>Delivery zone:</strong> Kalgoorlie & surrounds (6430–6438)</span>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/products"
                className="font-body text-xs text-dark-leather/50 hover:text-terra transition-colors tracking-widest uppercase"
              >
                ← Back to all products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
