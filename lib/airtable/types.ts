export interface Product {
  id: string              // Airtable record ID (rec...)
  name: string
  description: string
  price_cents: number     // Converted from Airtable "price" field (dollars) × 100
  image_url: string | null
  category: string
  available: boolean
  stripe_payment_link: string | null
}

// Raw types from the Airtable REST API response
export interface AirtableAttachment {
  id: string
  url: string
  filename: string
  size: number
  type: string
}

export interface AirtableFields {
  name?: string
  description?: string
  price?: number
  image?: AirtableAttachment[]
  category?: string
  available?: boolean
  stripe_payment_link?: string
}

export interface AirtableRecord {
  id: string
  createdTime: string
  fields: AirtableFields
}

export interface AirtableListResponse {
  records: AirtableRecord[]
  offset?: string
}
