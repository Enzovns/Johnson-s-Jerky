'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { SheriffStarIcon } from '@/components/decorations'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createSupabaseClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Invalid credentials, partner. Try again.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen gradient-sunset flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Wanted poster frame */}
        <div className="wanted-card">
          <div className="text-center mb-6">
            <SheriffStarIcon className="w-12 h-12 text-terra mx-auto mb-3" />
            <p className="wanted-badge text-dark-terra block mb-1">— Restricted Area —</p>
            <h1 className="font-western text-3xl text-leather">Trail Boss Login</h1>
            <p className="font-body text-xs text-dark-leather/60 mt-1 tracking-widest uppercase">
              Johnson&apos;s Jerky Admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm font-bold uppercase tracking-wider text-leather block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-western w-full"
                placeholder="boss@johnsonjerky.com.au"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="font-body text-sm font-bold uppercase tracking-wider text-leather block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-western w-full"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3">
                <p className="font-body text-sm text-red-700">⚠️ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-stamp w-full py-4 text-sm disabled:opacity-50"
            >
              {loading ? 'Riding in...' : '🤠 Enter the Saloon'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-parchment/30 mt-4 tracking-widest uppercase">
          Admin access only — no sign-ups
        </p>
      </div>
    </div>
  )
}
