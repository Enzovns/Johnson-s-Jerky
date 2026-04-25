import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice, formatDate, generateOrderNumber } from '@/lib/utils/format'
import { SheriffStarIcon } from '@/components/decorations'
import type { OrderWithItems } from '@/lib/supabase/types'

interface Props {
  searchParams: { session_id?: string; order_id?: string }
}

async function getOrder(sessionId: string): Promise<OrderWithItems | null> {
  try {
    const supabase = createSupabaseServer()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('stripe_session_id', sessionId)
      .single()
    return data as OrderWithItems
  } catch {
    return null
  }
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id } = searchParams
  const order = session_id ? await getOrder(session_id) : null

  return (
    <div className="min-h-screen section-parchment">
      <div className="bg-leather py-16 text-center">
        <div className="flex justify-center mb-4">
          <SheriffStarIcon className="w-16 h-16 text-gold animate-float-slow" />
        </div>
        <h1 className="font-western text-5xl md:text-6xl text-gold text-western-shadow-light mb-2">
          Order Confirmed!
        </h1>
        <p className="font-body text-sand/60 text-sm tracking-widest uppercase">
          Yeehaw! Your jerky is on its way.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {order ? (
          <div className="wanted-card">
            <p className="wanted-badge text-dark-terra border-b border-dark-terra/20 pb-2 mb-6 text-center">
              Order Receipt
            </p>

            <div className="space-y-6">
              {/* Numéro et date */}
              <div className="grid grid-cols-2 gap-4 font-body text-sm">
                <div>
                  <span className="text-dark-leather/60 block uppercase tracking-widest text-xs">Order #</span>
                  <span className="font-bold text-leather">{generateOrderNumber(order.id)}</span>
                </div>
                <div>
                  <span className="text-dark-leather/60 block uppercase tracking-widest text-xs">Date</span>
                  <span className="font-bold text-leather">{formatDate(order.created_at)}</span>
                </div>
                <div>
                  <span className="text-dark-leather/60 block uppercase tracking-widest text-xs">Email</span>
                  <span className="font-bold text-leather">{order.customer_email}</span>
                </div>
                <div>
                  <span className="text-dark-leather/60 block uppercase tracking-widest text-xs">Status</span>
                  <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'}`}>
                    {order.payment_status === 'paid' ? '✓ Paid' : '⏳ Processing'}
                  </span>
                </div>
              </div>

              {/* Produits */}
              <div className="border-t border-dark-terra/20 pt-4">
                <h3 className="font-western text-lg text-leather mb-3">Your Order</h3>
                <div className="space-y-2">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex justify-between font-body text-sm text-dark-leather">
                      <span>{item.product?.name || 'Product'} ×{item.quantity}</span>
                      <span className="font-bold">{formatPrice(item.price_at_purchase_cents * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="border-t border-dark-terra/20 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-dark-leather">
                  <span>Shipping ({order.shipping_method})</span>
                  <span>{formatPrice(order.shipping_cost_cents)}</span>
                </div>
                <div className="flex justify-between font-western text-2xl text-leather">
                  <span>Total</span>
                  <span className="text-terra">{formatPrice(order.total_cents)}</span>
                </div>
              </div>

              {/* Adresse */}
              <div className="border-t border-dark-terra/20 pt-4">
                <h3 className="font-western text-lg text-leather mb-2">Delivering to</h3>
                <p className="font-body text-sm text-dark-leather">
                  {order.customer_name}<br />
                  {order.shipping_address}<br />
                  {order.suburb} {order.state} {order.postcode}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="wanted-card text-center py-8">
            <SheriffStarIcon className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="font-western text-3xl text-leather mb-3">
              Thanks for your order!
            </h2>
            <p className="font-body text-dark-leather/70 mb-2">
              You&apos;ll receive a confirmation email shortly.
            </p>
            <p className="font-body text-sm text-dark-leather/50">
              Check your spam folder if you don&apos;t see it in a few minutes.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/products" className="btn-stamp px-8 py-3 inline-block hover:no-underline">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  )
}
