import { NextResponse } from 'next/server'
import { fetchProducts } from '@/lib/airtable/client'

export const revalidate = 60

export async function GET() {
  try {
    const products = await fetchProducts()
    return NextResponse.json(products)
  } catch (err) {
    console.error('Airtable fetch error:', err)
    return NextResponse.json({ error: 'Failed to load products.' }, { status: 500 })
  }
}
