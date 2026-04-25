export type Product = {
  id: string
  name: string
  description: string
  price_cents: number
  stock: number
  image_url: string | null
  featured: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  postcode: string
  suburb: string
  state: string
  shipping_method: 'standard' | 'express'
  shipping_cost_cents: number
  total_cents: number
  stripe_session_id: string | null
  payment_status: 'pending' | 'paid' | 'failed'
  fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered'
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase_cents: number
  product?: Product
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & { product: Product })[]
}

export type ShippingRate = {
  id: string
  method_name: 'standard' | 'express'
  price_cents: number
  estimated_days: string
}

export type SiteConfig = {
  key: string
  value: string
}

export type CartItem = {
  id: string
  name: string
  price_cents: number
  quantity: number
  image_url: string | null
}
