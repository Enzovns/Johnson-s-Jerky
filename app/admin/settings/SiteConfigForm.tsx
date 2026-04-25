'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import type { SiteConfig } from '@/lib/supabase/types'

const CONFIG_LABELS: Record<string, string> = {
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
  hero_tagline: 'Hero Tagline',
  about_text: 'About Text',
}

export default function SiteConfigForm({ config }: { config: SiteConfig[] }) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(config.map(c => [c.key, c.value]))
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const supabase = createSupabaseClient()
    for (const [key, value] of Object.entries(values)) {
      await supabase
        .from('site_config')
        .upsert({ key, value }, { onConflict: 'key' })
    }
    setLoading(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); router.refresh() }, 1500)
  }

  const keys = Object.keys(CONFIG_LABELS)

  return (
    <div className="space-y-4">
      {keys.map(key => (
        <div key={key} className="flex flex-col gap-1">
          <label className="font-body text-sm font-bold text-sand/80 uppercase tracking-wider">
            {CONFIG_LABELS[key]}
          </label>
          <textarea
            value={values[key] || ''}
            onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 font-body text-sm bg-leather/30 border border-terra/30 text-sand/80 placeholder-sand/20 focus:outline-none focus:border-terra resize-none"
          />
        </div>
      ))}
      <button onClick={handleSave} disabled={loading} className="btn-stamp px-6 py-2.5 text-sm mt-2 disabled:opacity-50">
        {loading ? 'Saving...' : success ? '✓ Saved!' : 'Save Content'}
      </button>
    </div>
  )
}
