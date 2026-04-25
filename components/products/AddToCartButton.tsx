'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import type { Product } from '@/lib/supabase/types'

interface Props {
  product: Product
  quantity?: number
  compact?: boolean
}

export default function AddToCartButton({ product, quantity = 1, compact = false }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        image_url: product.image_url,
      },
      quantity
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={added}
        className={`btn-stamp px-3 py-1.5 text-xs transition-all ${
          added ? 'bg-green-700 border-green-900 cursor-default' : ''
        }`}
        title="Add to Wagon"
      >
        {added ? '✓' : '+'}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`btn-stamp w-full py-3.5 text-sm transition-all ${
        added ? 'bg-green-700 border-green-900' : ''
      }`}
    >
      {added ? '✓ Added to Wagon!' : '🤠 Add to Wagon'}
    </button>
  )
}
