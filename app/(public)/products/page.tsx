import Image from 'next/image'
import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import { SheriffStarIcon } from '@/components/decorations'
import AddToCartButton from '@/components/products/AddToCartButton'
import type { Product } from '@/lib/supabase/types'

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createSupabaseServer()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name')
    return data || []
  } catch {
    return DEMO_PRODUCTS
  }
}

export const metadata = {
  title: "All Products — Johnson's Jerky",
  description: 'Browse our full range of premium beef jerky and biltong.',
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen section-parchment">
      {/* En-tête */}
      <div className="bg-leather py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23C9A961%22%20fill-opacity%3D%221%22%3E%3Cpath%20d%3D%22M20%200L0%2020h40z%22/%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="relative z-10">
          <p className="wanted-badge text-gold/60 block mb-2">— The Full Spread —</p>
          <h1 className="font-western text-5xl md:text-6xl text-gold text-western-shadow-light mb-4">
            Our Products
          </h1>
          <div className="divider-western max-w-xs mx-auto text-gold">
            <SheriffStarIcon className="w-5 h-5" />
          </div>
          <p className="font-body text-sand/60 text-sm mt-4 tracking-widest uppercase">
            Handcrafted in Kalgoorlie, WA
          </p>
        </div>
      </div>

      {/* Grille produits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-western text-3xl text-dark-leather">The shelves are bare, partner.</p>
            <p className="font-body text-dark-leather/60 mt-2">Check back soon — the next batch is drying.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0

  return (
    <article className={`wanted-card flex flex-col ${outOfStock ? 'opacity-60' : 'hover:scale-[1.02] transition-transform duration-200'}`}>
      <p className="wanted-badge text-center text-dark-terra border-b border-dark-terra/20 pb-2 mb-3">
        ★ WANTED ★
      </p>

      <Link href={`/products/${product.id}`} className="block relative w-full aspect-square mb-3 overflow-hidden bg-sand/50">
        {/* À remplacer par photo réelle */}
        <Image
          src={product.image_url || `https://placehold.co/400x400/B85C38/F5E6D3?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {outOfStock && (
          <div className="absolute inset-0 bg-leather/60 flex items-center justify-center">
            <span className="font-western text-2xl text-parchment transform -rotate-12 border-4 border-parchment px-4 py-2">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <Link href={`/products/${product.id}`}>
          <h2 className="font-western text-lg text-leather leading-tight hover:text-terra transition-colors mb-1">
            {product.name}
          </h2>
        </Link>
        <p className="font-body text-xs text-dark-leather/70 line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-western text-2xl text-terra">
            {formatPrice(product.price_cents)}
          </span>
          {!outOfStock ? (
            <AddToCartButton product={product} compact />
          ) : (
            <span className="font-body text-xs text-red-700 uppercase tracking-wider">Out of stock</span>
          )}
        </div>
      </div>
    </article>
  )
}

const DEMO_PRODUCTS: Product[] = [
  { id: 'd1', name: 'Outback Beef Jerky — Original', description: 'Slow-dried premium beef with classic outback seasoning. Simple, bold, unforgettable.', price_cents: 1800, stock: 20, image_url: 'https://placehold.co/400x400/B85C38/F5E6D3?text=Outback+Jerky', featured: true, created_at: '' },
  { id: 'd2', name: 'Roo Biltong', description: "Kangaroo dried with traditional bush spices. Lean, rich, uniquely Australian.", price_cents: 2200, stock: 15, image_url: 'https://placehold.co/400x400/8B3A1F/E8D5B7?text=Roo+Biltong', featured: true, created_at: '' },
  { id: 'd3', name: 'Smoky Bushranger Jerky', description: 'Smoked beef with cracked pepper and roasted garlic. Ride hard, eat harder.', price_cents: 2500, stock: 12, image_url: 'https://placehold.co/400x400/3E2723/C9A961?text=Bushranger', featured: true, created_at: '' },
  { id: 'd4', name: 'Spicy Desert Strips', description: 'Chilli and paprika-crusted beef strips with slow Outback heat.', price_cents: 1900, stock: 18, image_url: 'https://placehold.co/400x400/C9A961/3E2723?text=Spicy+Desert', featured: true, created_at: '' },
]
