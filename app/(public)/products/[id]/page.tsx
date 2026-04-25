import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import { SheriffStarIcon } from '@/components/decorations'
import QuantityAddToCart from '@/components/products/QuantityAddToCart'
import type { Product } from '@/lib/supabase/types'

interface Props {
  params: { id: string }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createSupabaseServer()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.id)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} — Johnson's Jerky`,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id)
  if (!product) notFound()

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
              {/* À remplacer par photo réelle */}
              <Image
                src={product.image_url || `https://placehold.co/600x600/B85C38/F5E6D3?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-leather/60 flex items-center justify-center">
                  <span className="font-western text-3xl text-parchment transform -rotate-12 border-4 border-parchment px-6 py-3">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Détails */}
          <div className="py-2">
            <p className="wanted-badge text-terra block mb-2 tracking-[0.3em]">
              — Johnson&apos;s Jerky —
            </p>

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

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 5 ? (
                <span className="font-body text-xs text-green-700 bg-green-100 border border-green-200 px-3 py-1 uppercase tracking-widest">
                  ✓ In Stock
                </span>
              ) : product.stock > 0 ? (
                <span className="font-body text-xs text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 uppercase tracking-widest">
                  ⚡ Only {product.stock} left!
                </span>
              ) : (
                <span className="font-body text-xs text-red-700 bg-red-100 border border-red-200 px-3 py-1 uppercase tracking-widest">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Quantité + panier */}
            {product.stock > 0 && (
              <QuantityAddToCart product={product} maxQty={product.stock} />
            )}

            {/* Info livraison */}
            <div className="mt-8 border border-terra/20 bg-terra/5 p-4">
              <p className="font-body text-xs text-dark-leather space-y-1">
                <span className="block">🚚 <strong>Standard delivery:</strong> 3–5 business days</span>
                <span className="block">⚡ <strong>Express delivery:</strong> 1–2 business days</span>
                <span className="block">📍 <strong>Delivery zone:</strong> Kalgoorlie & surrounds (6430–6438)</span>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/products" className="font-body text-xs text-dark-leather/50 hover:text-terra transition-colors tracking-widest uppercase">
                ← Back to all products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
