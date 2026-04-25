import Link from 'next/link'
import ProductForm from '../ProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="font-body text-xs text-sand/40 hover:text-gold transition-colors uppercase tracking-widest">
          ← Products
        </Link>
        <span className="text-sand/20">/</span>
        <h1 className="font-western text-3xl text-gold">New Product</h1>
      </div>
      <div className="bg-leather/30 border border-terra/20 p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
