import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { isValidDeliveryPostcode } from '@/lib/utils/postcodes'

interface CheckoutBody {
  items: { product_id: string; quantity: number; price_cents: number; name: string }[]
  customer: { name: string; email: string; phone: string }
  shipping_address: string
  suburb: string
  state: string
  postcode: string
  shipping_method: 'standard' | 'express'
  shipping_cost_cents: number
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, customer, shipping_address, suburb, state, postcode, shipping_method, shipping_cost_cents } = body

    // Validation postcode
    if (!isValidDeliveryPostcode(postcode)) {
      return NextResponse.json({ error: 'Delivery not available for this postcode.' }, { status: 400 })
    }

    // Validation basique
    if (!items?.length || !customer?.email || !customer?.name) {
      return NextResponse.json({ error: 'Invalid order data.' }, { status: 400 })
    }

    // Vérifier les produits en base et récupérer les vrais prix
    const productIds = items.map(i => i.product_id)
    const { data: products, error: productError } = await getSupabaseAdmin()
      .from('products')
      .select('id, name, price_cents, stock')
      .in('id', productIds)

    if (productError || !products?.length) {
      return NextResponse.json({ error: 'Could not verify products.' }, { status: 400 })
    }

    // Vérifier le stock et recalculer les prix côté serveur
    for (const item of items) {
      const product = products.find(p => p.id === item.product_id)
      if (!product) return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 })
      if (product.stock < item.quantity) return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 })
    }

    const verifiedItems = items.map(item => ({
      ...item,
      price_cents: products.find(p => p.id === item.product_id)!.price_cents,
    }))

    const subtotalCents = verifiedItems.reduce((sum, i) => sum + i.price_cents * i.quantity, 0)
    const totalCents = subtotalCents + shipping_cost_cents

    // Créer la commande en base (statut pending)
    const { data: order, error: orderError } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address,
        suburb,
        state,
        postcode,
        shipping_method,
        shipping_cost_cents,
        total_cents: totalCents,
        payment_status: 'pending',
        fulfillment_status: 'pending',
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 })
    }

    // Créer les order_items
    await getSupabaseAdmin().from('order_items').insert(
      verifiedItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase_cents: item.price_cents,
      }))
    )

    // Décrémenter le stock
    for (const item of verifiedItems) {
      await getSupabaseAdmin().rpc('decrement_stock', { product_id: item.product_id, qty: item.quantity })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'aud',
      customer_email: customer.email,
      metadata: { order_id: order.id },
      line_items: [
        ...verifiedItems.map(item => ({
          price_data: {
            currency: 'aud',
            product_data: { name: products.find(p => p.id === item.product_id)!.name },
            unit_amount: item.price_cents,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: 'aud',
            product_data: { name: `Shipping — ${shipping_method === 'standard' ? 'Standard' : 'Express'}` },
            unit_amount: shipping_cost_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    })

    // Sauvegarder le session ID Stripe sur la commande
    await getSupabaseAdmin()
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
