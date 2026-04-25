import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase/server'
import AdminNav from '@/components/layout/AdminNav'

export const metadata = { title: "Admin — Johnson's Jerky" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#1a1210]">
      {/* Header admin */}
      <header className="bg-leather border-b-2 border-terra/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-western text-xl text-gold hover:text-sand transition-colors">
              Johnson&apos;s Jerky
            </Link>
            <span className="font-body text-xs text-sand/40 uppercase tracking-widest">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="font-body text-xs text-sand/50 hover:text-gold transition-colors uppercase tracking-widest">
              View Site ↗
            </Link>
            <AdminSignOut />
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-6 min-h-[calc(100vh-57px)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

// Composant client pour le sign-out
function AdminSignOut() {
  return (
    <form action="/api/admin/signout" method="POST">
      <button type="submit" className="font-body text-xs text-sand/50 hover:text-red-400 transition-colors uppercase tracking-widest">
        Sign Out
      </button>
    </form>
  )
}
