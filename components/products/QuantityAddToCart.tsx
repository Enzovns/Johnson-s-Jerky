'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/supabase/types'

interface Props {
  product: Product
  maxQty: number
}

export default function QuantityAddToCart({ product, maxQty }: Props) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price_cents: product.price_cents, image_url: product.image_url }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur de quantité */}
      <div className="flex items-center gap-4">
        <span className="font-body text-sm uppercase tracking-widest text-leather font-bold">Qty</span>
        <div className="flex items-center border-2 border-leather/30">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="px-3 py-2 font-body font-bold text-leather hover:bg-sand/50 transition-colors"
          >
            −
          </button>
          <span className="px-4 py-2 font-body font-bold text-leather border-x border-leather/30 min-w-[48px] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(q => Math.min(maxQty, q + 1))}
            className="px-3 py-2 font-body font-bold text-leather hover:bg-sand/50 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={added}
        className={`btn-stamp w-full py-4 text-base transition-all ${added ? 'bg-green-700 border-green-900' : ''}`}
      >
        {added ? '✓ Added to Wagon!' : '🤠 Add to Wagon'}
      </button>
    </div>
  )
}
