'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return
    setLoading(true)
    const supabase = createSupabaseClient()
    await supabase.from('products').delete().eq('id', productId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-body text-xs text-red-500/60 hover:text-red-400 transition-colors uppercase tracking-widest disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  )
}
