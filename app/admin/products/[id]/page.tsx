import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import ProductForm from '../ProductForm'

interface Props {
  params: { id: string }
}

async function getProduct(id: string) {
  const supabase = createSupabaseServer()
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return data
}

export default async function EditProductPage({ params }: Props) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="font-body text-xs text-sand/40 hover:text-gold transition-colors uppercase tracking-widest">
          ← Products
        </Link>
        <span className="text-sand/20">/</span>
        <h1 className="font-western text-3xl text-gold">Edit Product</h1>
      </div>
      <div className="bg-leather/30 border border-terra/20 p-6">
        <ProductForm product={product} mode="edit" />
      </div>
    </div>
  )
}
