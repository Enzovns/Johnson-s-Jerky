import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

// Important : désactiver le body parsing de Next.js pour lire le raw body (nécessaire pour vérifier la signature Stripe)
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (!orderId) break

      await getSupabaseAdmin()
        .from('orders')
        .update({
          payment_status: 'paid',
          fulfillment_status: 'processing',
          stripe_session_id: session.id,
        })
        .eq('id', orderId)

      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (!orderId) break

      // Marquer comme échoué et remettre le stock
      await getSupabaseAdmin()
        .from('orders')
        .update({ payment_status: 'failed' })
        .eq('id', orderId)

      // Récupérer et remettre le stock
      const { data: orderItems } = await getSupabaseAdmin()
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId)

      if (orderItems) {
        for (const item of orderItems) {
          await getSupabaseAdmin().rpc('increment_stock', { product_id: item.product_id, qty: item.quantity })
        }
      }

      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      if (pi.metadata?.order_id) {
        await getSupabaseAdmin()
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('id', pi.metadata.order_id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
