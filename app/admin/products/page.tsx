import Link from 'next/link'
import Image from 'next/image'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import DeleteProductButton from './DeleteProductButton'
import type { Product } from '@/lib/supabase/types'

async function getProducts(): Promise<Product[]> {
  const supabase = createSupabaseServer()
  const { data } = await supabase.from('products').select('*').order('name')
  return data || []
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-western text-3xl text-gold">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn-stamp px-5 py-2.5 text-sm inline-block hover:no-underline"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-leather/30 border border-terra/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terra/30 bg-leather/50">
                {['Image', 'Name', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-xs text-sand/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center font-body text-sm text-sand/30">
                    No products yet. Add your first cut!
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-terra/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 bg-sand/10 overflow-hidden">
                        <Image
                          src={product.image_url || `https://placehold.co/48x48/B85C38/F5E6D3?text=?`}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-sand/80">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 font-western text-terra">{formatPrice(product.price_cents)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={product.stock === 0 ? 'error' : product.stock < 5 ? 'warning' : 'success'}>
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {product.featured ? (
                        <Badge variant="gold">★ Featured</Badge>
                      ) : (
                        <span className="font-body text-xs text-sand/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-body text-xs text-sand/60 hover:text-gold transition-colors uppercase tracking-widest"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
