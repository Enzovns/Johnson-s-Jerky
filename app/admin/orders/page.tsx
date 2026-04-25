import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice, formatDate, generateOrderNumber } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import OrderActions from './OrderActions'
import type { OrderWithItems } from '@/lib/supabase/types'

async function getOrders(): Promise<OrderWithItems[]> {
  const supabase = createSupabaseServer()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(name))')
    .order('created_at', { ascending: false })
  return (data || []) as OrderWithItems[]
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-western text-3xl text-gold">Orders</h1>
        <span className="font-body text-sm text-sand/40">{orders.length} total</span>
      </div>

      <div className="bg-leather/30 border border-terra/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terra/30 bg-leather/50">
                {['Order #', 'Customer', 'Contact', 'Address', 'Items', 'Shipping', 'Total', 'Payment', 'Fulfilment', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-body text-xs text-sand/40 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center font-body text-sm text-sand/30">
                    No orders yet. Share the site and they&apos;ll come riding in.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-b border-terra/10 hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3 font-body text-xs text-gold font-bold whitespace-nowrap">
                      {generateOrderNumber(order.id)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-body text-sm text-sand/80 whitespace-nowrap">{order.customer_name}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-body text-xs text-sand/60">{order.customer_email}</div>
                      <div className="font-body text-xs text-sand/40">{order.customer_phone}</div>
                    </td>
                    <td className="px-3 py-3 font-body text-xs text-sand/60 max-w-[160px]">
                      <div>{order.shipping_address}</div>
                      <div>{order.suburb} {order.state} {order.postcode}</div>
                    </td>
                    <td className="px-3 py-3 font-body text-xs text-sand/60 max-w-[180px]">
                      {order.order_items?.map(item => (
                        <div key={item.id} className="whitespace-nowrap">
                          {item.product?.name || '?'} ×{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-3 py-3 font-body text-xs text-sand/60 whitespace-nowrap capitalize">
                      {order.shipping_method}
                      <div className="text-sand/40">{formatPrice(order.shipping_cost_cents)}</div>
                    </td>
                    <td className="px-3 py-3 font-western text-terra whitespace-nowrap">
                      {formatPrice(order.total_cents)}
                    </td>
                    <td className="px-3 py-3">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-3 py-3">
                      <FulfilmentBadge status={order.fulfillment_status} />
                    </td>
                    <td className="px-3 py-3 font-body text-xs text-sand/40 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-3 py-3">
                      <OrderActions orderId={order.id} currentStatus={order.fulfillment_status} />
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

function PaymentBadge({ status }: { status: string }) {
  if (status === 'paid') return <Badge variant="success">Paid</Badge>
  if (status === 'failed') return <Badge variant="error">Failed</Badge>
  return <Badge variant="warning">Pending</Badge>
}

function FulfilmentBadge({ status }: { status: string }) {
  if (status === 'delivered') return <Badge variant="success">Delivered</Badge>
  if (status === 'shipped') return <Badge variant="gold">Shipped</Badge>
  if (status === 'processing') return <Badge variant="default">Processing</Badge>
  return <Badge variant="warning">Pending</Badge>
}
