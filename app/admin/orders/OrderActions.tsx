'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'

type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

const STATUS_FLOW: Record<FulfillmentStatus, { next: FulfillmentStatus | null; label: string }> = {
  pending: { next: 'processing', label: 'Mark Processing' },
  processing: { next: 'shipped', label: 'Mark Shipped' },
  shipped: { next: 'delivered', label: 'Mark Delivered' },
  delivered: { next: null, label: 'Delivered ✓' },
}

export default function OrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: FulfillmentStatus }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { next, label } = STATUS_FLOW[currentStatus] || STATUS_FLOW.pending

  const advance = async () => {
    if (!next) return
    setLoading(true)
    const supabase = createSupabaseClient()
    await supabase.from('orders').update({ fulfillment_status: next }).eq('id', orderId)
    router.refresh()
    setLoading(false)
  }

  if (!next) {
    return <span className="font-body text-xs text-green-400">{label}</span>
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="font-body text-xs bg-terra/20 hover:bg-terra/40 border border-terra/30 text-sand/80 hover:text-gold px-2 py-1 uppercase tracking-wider transition-all whitespace-nowrap disabled:opacity-50"
    >
      {loading ? '...' : label}
    </button>
  )
}
