'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/utils/format'
import { isValidDeliveryPostcode, POSTCODE_ERROR_MESSAGE } from '@/lib/utils/postcodes'
import { SheriffStarIcon } from '@/components/decorations'
import Input from '@/components/ui/Input'

type ShippingMethod = 'standard' | 'express'

interface ShippingRate {
  id: string
  method_name: ShippingMethod
  price_cents: number
  estimated_days: string
}

const FALLBACK_RATES: ShippingRate[] = [
  { id: 'std', method_name: 'standard', price_cents: 850, estimated_days: '3–5 business days' },
  { id: 'exp', method_name: 'express', price_cents: 1800, estimated_days: '1–2 business days' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotalCents, clearCart } = useCart()

  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(FALLBACK_RATES)
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>('standard')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    state: 'WA',
    postcode: '',
  })

  useEffect(() => {
    fetch('/api/shipping-rates')
      .then(r => r.json())
      .then(data => { if (data?.length) setShippingRates(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (items.length === 0) router.push('/cart')
  }, [items, router])

  const selectedRate = shippingRates.find(r => r.method_name === selectedShipping)!
  const totalCents = subtotalCents + (selectedRate?.price_cents || 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.first_name.trim()) newErrors.first_name = 'Required'
    if (!form.last_name.trim()) newErrors.last_name = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required'
    if (!form.phone.trim()) newErrors.phone = 'Required'
    if (!form.address.trim()) newErrors.address = 'Required'
    if (!form.suburb.trim()) newErrors.suburb = 'Required'
    if (!form.postcode.trim()) newErrors.postcode = 'Required'
    else if (!isValidDeliveryPostcode(form.postcode)) newErrors.postcode = POSTCODE_ERROR_MESSAGE
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price_cents: i.price_cents, name: i.name })),
          customer: {
            name: `${form.first_name} ${form.last_name}`,
            email: form.email,
            phone: form.phone,
          },
          shipping_address: form.address,
          suburb: form.suburb,
          state: form.state,
          postcode: form.postcode,
          shipping_method: selectedShipping,
          shipping_cost_cents: selectedRate.price_cents,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')

      clearCart()
      window.location.href = data.url
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong. Please try again.' })
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen section-parchment">
      <div className="bg-leather py-12 text-center">
        <h1 className="font-western text-5xl text-gold text-western-shadow-light">Checkout</h1>
        <p className="font-body text-sand/50 text-sm mt-2 tracking-widest uppercase">
          Almost there, partner
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Formulaire */}
            <div className="lg:col-span-2 space-y-8">

              {/* Infos client */}
              <div className="wanted-card">
                <h2 className="font-western text-2xl text-leather mb-6 flex items-center gap-2">
                  <SheriffStarIcon className="w-5 h-5 text-terra" />
                  Your Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} autoComplete="given-name" />
                  <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} autoComplete="family-name" />
                  <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" className="sm:col-span-2" />
                  <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" placeholder="+61 400 000 000" />
                </div>
              </div>

              {/* Adresse */}
              <div className="wanted-card">
                <h2 className="font-western text-2xl text-leather mb-6 flex items-center gap-2">
                  <SheriffStarIcon className="w-5 h-5 text-terra" />
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Street Address" name="address" value={form.address} onChange={handleChange} error={errors.address} autoComplete="street-address" placeholder="123 Hannan Street" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Suburb" name="suburb" value={form.suburb} onChange={handleChange} error={errors.suburb} autoComplete="address-level2" />
                    <div className="flex flex-col gap-1">
                      <label className="font-body text-sm font-bold uppercase tracking-wider text-leather">State</label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="input-western h-[50px]"
                      >
                        <option value="WA">WA</option>
                        <option value="NSW">NSW</option>
                        <option value="VIC">VIC</option>
                        <option value="QLD">QLD</option>
                        <option value="SA">SA</option>
                        <option value="TAS">TAS</option>
                        <option value="NT">NT</option>
                        <option value="ACT">ACT</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    label="Postcode"
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    error={errors.postcode}
                    maxLength={4}
                    placeholder="6430"
                    autoComplete="postal-code"
                  />
                  {errors.postcode && errors.postcode.length > 10 && (
                    <p className="text-sm font-body text-red-700 bg-red-50 border border-red-200 p-3">
                      ⚠️ {errors.postcode}
                    </p>
                  )}
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="wanted-card">
                <h2 className="font-western text-2xl text-leather mb-6 flex items-center gap-2">
                  <SheriffStarIcon className="w-5 h-5 text-terra" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingRates.map(rate => (
                    <label
                      key={rate.id}
                      className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-all ${
                        selectedShipping === rate.method_name
                          ? 'border-terra bg-terra/10'
                          : 'border-leather/20 hover:border-terra/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={rate.method_name}
                          checked={selectedShipping === rate.method_name}
                          onChange={() => setSelectedShipping(rate.method_name)}
                          className="accent-terra"
                        />
                        <div>
                          <span className="font-body font-bold text-leather uppercase tracking-wider text-sm block">
                            {rate.method_name === 'standard' ? '🚚 Standard' : '⚡ Express'}
                          </span>
                          <span className="font-body text-xs text-dark-leather/60">{rate.estimated_days}</span>
                        </div>
                      </div>
                      <span className="font-western text-xl text-terra">{formatPrice(rate.price_cents)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="wanted-card sticky top-24">
                <p className="wanted-badge text-dark-terra border-b border-dark-terra/20 pb-2 mb-4 text-center">
                  Order Summary
                </p>

                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between font-body text-xs text-dark-leather">
                      <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                      <span className="font-bold flex-shrink-0">{formatPrice(item.price_cents * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark-terra/20 pt-3 mb-4 space-y-2">
                  <div className="flex justify-between font-body text-sm text-dark-leather">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotalCents)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-dark-leather">
                    <span>Shipping</span>
                    <span className="font-bold">{formatPrice(selectedRate?.price_cents || 0)}</span>
                  </div>
                </div>

                <div className="border-t border-dark-terra/20 pt-3 mb-6">
                  <div className="flex justify-between font-western text-2xl text-leather">
                    <span>Total</span>
                    <span className="text-terra">{formatPrice(totalCents)}</span>
                  </div>
                  <p className="font-body text-xs text-dark-leather/40 mt-1 text-right">AUD incl. GST</p>
                </div>

                {errors.form && (
                  <div className="bg-red-50 border border-red-200 p-3 mb-4">
                    <p className="font-body text-xs text-red-700">{errors.form}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-stamp w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Heading to Stripe...
                    </span>
                  ) : (
                    '💳 Pay with Stripe →'
                  )}
                </button>

                <p className="font-body text-xs text-dark-leather/40 text-center mt-3">
                  🔒 Secure payment via Stripe
                </p>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
