import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils/format'
import Badge from '@/components/ui/Badge'
import type { Order } from '@/lib/supabase/types'

async function getDashboardStats() {
  const supabase = createSupabaseServer()

  const [ordersRes, productsRes, revenueRes] = await Promise.all([
    supabase.from('orders').select('id, payment_status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, stock').lt('stock', 5),
    supabase.from('orders').select('total_cents').eq('payment_status', 'paid'),
  ])

  const recentOrders = ordersRes.data || []
  const lowStockCount = productsRes.data?.length || 0
  const totalRevenue = revenueRes.data?.reduce((sum, o) => sum + o.total_cents, 0) || 0
  const paidOrders = revenueRes.data?.length || 0

  const pendingCount = recentOrders.filter(o => o.payment_status === 'pending').length

  return { recentOrders, lowStockCount, totalRevenue, paidOrders, pendingCount }
}

async function getRecentOrders(): Promise<Order[]> {
  const supabase = createSupabaseServer()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders()])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-western text-3xl text-gold text-western-shadow-light">Dashboard</h1>
        <p className="font-body text-sand/40 text-sm mt-1">Welcome back, Trail Boss.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: 'text-green-400', icon: '💰' },
          { label: 'Paid Orders', value: stats.paidOrders.toString(), color: 'text-blue-400', icon: '📦' },
          { label: 'Pending Orders', value: stats.pendingCount.toString(), color: 'text-amber-400', icon: '⏳' },
          { label: 'Low Stock Items', value: stats.lowStockCount.toString(), color: 'text-red-400', icon: '⚠️' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="bg-leather/50 border border-terra/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{icon}</span>
              <span className="font-body text-xs text-sand/50 uppercase tracking-wider">{label}</span>
            </div>
            <p className={`font-western text-3xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/admin/products/new', label: '+ New Product', color: 'bg-terra/20 hover:bg-terra/30 border-terra/30' },
          { href: '/admin/orders', label: 'View Orders', color: 'bg-leather hover:bg-leather/80 border-terra/30' },
          { href: '/admin/settings', label: 'Settings', color: 'bg-leather hover:bg-leather/80 border-terra/30' },
          { href: '/products', label: 'View Storefront ↗', color: 'bg-leather hover:bg-leather/80 border-terra/30' },
        ].map(({ href, label, color }) => (
          <Link
            key={href}
            href={href}
            className={`${color} border px-4 py-3 font-body text-sm text-sand/80 hover:text-gold transition-all uppercase tracking-wider text-center`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-leather/30 border border-terra/20">
        <div className="flex items-center justify-between px-6 py-4 border-b border-terra/20">
          <h2 className="font-western text-xl text-gold">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-xs text-sand/50 hover:text-gold transition-colors uppercase tracking-widest">
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-terra/20">
                {['Customer', 'Email', 'Total', 'Payment', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-xs text-sand/40 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center font-body text-sm text-sand/30">
                    No orders yet. The wagon trail is quiet.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-terra/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-body text-sm text-sand/80">{order.customer_name}</td>
                    <td className="px-4 py-3 font-body text-xs text-sand/50">{order.customer_email}</td>
                    <td className="px-4 py-3 font-western text-terra">{formatPrice(order.total_cents)}</td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-sand/50">{formatDate(order.created_at)}</td>
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

function PaymentBadge({ status }: { status: Order['payment_status'] }) {
  if (status === 'paid') return <Badge variant="success">Paid</Badge>
  if (status === 'failed') return <Badge variant="error">Failed</Badge>
  return <Badge variant="warning">Pending</Badge>
}
