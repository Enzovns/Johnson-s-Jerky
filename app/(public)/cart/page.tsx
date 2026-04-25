'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/utils/format'
import { SheriffStarIcon } from '@/components/decorations'

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotalCents } = useCart()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen section-parchment flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 py-20">
          <SheriffStarIcon className="w-16 h-16 text-terra/30 mx-auto mb-6" />
          <h1 className="font-western text-4xl text-leather mb-4">Your Wagon&apos;s Empty</h1>
          <p className="font-body text-dark-leather/60 mb-8">
            Head back to the saloon and fill her up, partner.
          </p>
          <Link href="/products" className="btn-stamp px-8 py-3 inline-block hover:no-underline">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen section-parchment">
      <div className="bg-leather py-12 text-center">
        <h1 className="font-western text-5xl text-gold text-western-shadow-light">Your Wagon</h1>
        <p className="font-body text-sand/50 text-sm mt-2 tracking-widest uppercase">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Liste articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="wanted-card flex items-center gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-sand/50">
                  <Image
                    src={item.image_url || `https://placehold.co/80x80/B85C38/F5E6D3?text=${encodeURIComponent(item.name.slice(0, 3))}`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-western text-lg text-leather leading-tight truncate">
                    {item.name}
                  </h3>
                  <p className="font-western text-terra text-lg">
                    {formatPrice(item.price_cents)}
                  </p>
                </div>

                {/* Quantité */}
                <div className="flex items-center border border-leather/30">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 text-leather hover:bg-sand/50 transition-colors font-bold"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 font-body text-sm font-bold text-leather border-x border-leather/30 min-w-[36px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 text-leather hover:bg-sand/50 transition-colors font-bold"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>

                {/* Sous-total + supprimer */}
                <div className="text-right flex-shrink-0">
                  <p className="font-western text-terra font-bold">
                    {formatPrice(item.price_cents * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-body text-xs text-red-600 hover:text-red-800 mt-1 uppercase tracking-widest transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="wanted-card sticky top-24">
              <p className="wanted-badge text-dark-terra border-b border-dark-terra/20 pb-2 mb-4 text-center">
                Order Summary
              </p>

              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between font-body text-sm text-dark-leather">
                    <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="flex-shrink-0 font-bold">{formatPrice(item.price_cents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-terra/20 pt-4 mb-6">
                <div className="flex justify-between font-body text-sm text-dark-leather mb-1">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between font-body text-xs text-dark-leather/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between font-western text-2xl text-leather mb-6">
                <span>Total</span>
                <span className="text-terra">{formatPrice(subtotalCents)}</span>
              </div>

              <Link
                href="/checkout"
                className="btn-stamp w-full py-4 text-sm text-center block hover:no-underline"
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/products"
                className="block text-center font-body text-xs text-dark-leather/50 hover:text-terra mt-3 uppercase tracking-widest transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
