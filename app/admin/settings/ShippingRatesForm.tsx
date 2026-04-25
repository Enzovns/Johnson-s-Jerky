'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils/format'
import type { ShippingRate } from '@/lib/supabase/types'

export default function ShippingRatesForm({ rates }: { rates: ShippingRate[] }) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rates.map(r => [r.id, (r.price_cents / 100).toFixed(2)]))
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    for (const rate of rates) {
      const newPrice = Math.round(parseFloat(values[rate.id]) * 100)
      if (!isNaN(newPrice) && newPrice > 0) {
        await supabase.from('shipping_rates').update({ price_cents: newPrice }).eq('id', rate.id)
      }
    }
    setLoading(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
  }

  return (
    <div className="space-y-4">
      {rates.length === 0 ? (
        <p className="font-body text-sm text-sand/40">No shipping rates configured. Run the SQL migration first.</p>
      ) : (
        rates.map(rate => (
          <div key={rate.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-body text-sm font-bold text-sand/80 uppercase tracking-wider capitalize">
                {rate.method_name} — {rate.estimated_days}
              </p>
              <p className="font-body text-xs text-sand/40">Currently: {formatPrice(rate.price_cents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-sand/60">AUD</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={values[rate.id] || ''}
                onChange={e => setValues(v => ({ ...v, [rate.id]: e.target.value }))}
                className="w-24 px-3 py-2 font-body bg-leather/30 border border-terra/30 text-sand/80 focus:outline-none focus:border-terra"
              />
            </div>
          </div>
        ))
      )}
      {rates.length > 0 && (
        <button onClick={handleSave} disabled={loading} className="btn-stamp px-6 py-2.5 text-sm mt-4 disabled:opacity-50">
          {loading ? 'Saving...' : success ? '✓ Saved!' : 'Save Rates'}
        </button>
      )}
    </div>
  )
}
