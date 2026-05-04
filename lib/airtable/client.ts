import type { Product, AirtableRecord, AirtableListResponse } from './types'

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0'

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

function mapRecord(record: AirtableRecord): Product {
  const f = record.fields
  const attachments = f.image
  return {
    id: record.id,
    name: f.name ?? '',
    description: f.description ?? '',
    price_cents: Math.round((f.price ?? 0) * 100),
    image_url: attachments?.[0]?.url ?? null,
    category: f.category ?? '',
    available: f.available ?? false,
    stripe_payment_link: f.stripe_payment_link ?? null,
  }
}

function tableUrl(): string {
  const baseId = process.env.AIRTABLE_BASE_ID
  const table = process.env.AIRTABLE_PRODUCTS_TABLE ?? 'Products'
  return `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(table)}`
}

export async function fetchProducts(): Promise<Product[]> {
  const all: Product[] = []
  let offset: string | undefined

  do {
    const url = new URL(tableUrl())
    url.searchParams.set('pageSize', '100')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: authHeaders(),
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error(`Airtable error ${res.status}: ${await res.text()}`)
    }

    const data: AirtableListResponse = await res.json()
    all.push(...data.records.map(mapRecord))
    offset = data.offset
  } while (offset)

  return all
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${tableUrl()}/${id}`, {
    headers: authHeaders(),
    next: { revalidate: 60 },
  })

  if (!res.ok) return null
  const record: AirtableRecord = await res.json()
  return mapRecord(record)
}
