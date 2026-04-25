import { createSupabaseServer } from '@/lib/supabase/server'
import ShippingRatesForm from './ShippingRatesForm'
import SiteConfigForm from './SiteConfigForm'
import type { ShippingRate, SiteConfig } from '@/lib/supabase/types'

async function getData() {
  const supabase = createSupabaseServer()
  const [ratesRes, configRes] = await Promise.all([
    supabase.from('shipping_rates').select('*').order('price_cents'),
    supabase.from('site_config').select('*'),
  ])
  return {
    rates: (ratesRes.data || []) as ShippingRate[],
    config: (configRes.data || []) as SiteConfig[],
  }
}

export default async function AdminSettingsPage() {
  const { rates, config } = await getData()

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="font-western text-3xl text-gold">Settings</h1>

      {/* Frais de livraison */}
      <div className="bg-leather/30 border border-terra/20 p-6">
        <h2 className="font-western text-2xl text-gold mb-6">Shipping Rates</h2>
        <ShippingRatesForm rates={rates} />
      </div>

      {/* Contenu du site */}
      <div className="bg-leather/30 border border-terra/20 p-6">
        <h2 className="font-western text-2xl text-gold mb-6">Site Content</h2>
        <SiteConfigForm config={config} />
      </div>
    </div>
  )
}
