import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createSupabaseServer()
    const { data, error } = await supabase
      .from('shipping_rates')
      .select('*')
      .order('price_cents')

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      [
        { id: 'std', method_name: 'standard', price_cents: 850, estimated_days: '3–5 business days' },
        { id: 'exp', method_name: 'express', price_cents: 1800, estimated_days: '1–2 business days' },
      ]
    )
  }
}
