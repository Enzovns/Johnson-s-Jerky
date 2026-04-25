'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createSupabaseClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import type { Product } from '@/lib/supabase/types'

interface Props {
  product?: Product
  mode: 'create' | 'edit'
}

export default function ProductForm({ product, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product ? (product.price_cents / 100).toFixed(2) : '',
    stock: product?.stock?.toString() || '0',
    image_url: product?.image_url || '',
    featured: product?.featured || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setImageUploading(true)
    setError('')

    try {
      const supabase = createSupabaseClient()
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      setForm(f => ({ ...f, image_url: publicUrl }))
    } catch (err) {
      setError('Image upload failed. Make sure the storage bucket exists.')
      console.error(err)
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) { setError('Enter a valid price'); return }
    const stock = parseInt(form.stock)
    if (isNaN(stock) || stock < 0) { setError('Enter a valid stock number'); return }

    setLoading(true)
    const supabase = createSupabaseClient()
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price_cents: Math.round(price * 100),
      stock,
      image_url: form.image_url || null,
      featured: form.featured,
    }

    let dbError
    if (mode === 'create') {
      const { error } = await supabase.from('products').insert(payload)
      dbError = error
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', product!.id)
      dbError = error
    }

    setLoading(false)
    if (dbError) {
      setError(dbError.message)
      return
    }

    setSuccess(mode === 'create' ? 'Product created!' : 'Product updated!')
    setTimeout(() => router.push('/admin/products'), 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required placeholder="Outback Beef Jerky — Original" />

      <div className="flex flex-col gap-1">
        <label className="font-body text-sm font-bold uppercase tracking-wider text-sand/80">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          placeholder="Slow-dried premium beef with classic outback seasoning..."
          className="w-full px-4 py-3 font-body bg-leather/30 border-2 border-terra/20 text-sand/80 placeholder-sand/20 focus:outline-none focus:border-terra transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (AUD)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
          placeholder="18.00"
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          required
          placeholder="20"
        />
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="font-body text-sm font-bold uppercase tracking-wider text-sand/80">
          Product Image
          {/* À remplacer par photo réelle */}
        </label>
        <div className="flex items-start gap-4">
          {form.image_url && (
            <div className="relative w-20 h-20 border border-terra/30 overflow-hidden flex-shrink-0">
              <Image src={form.image_url} alt="Preview" fill className="object-cover" sizes="80px" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageUploading}
              className="font-body text-xs text-sand/60 file:mr-3 file:py-2 file:px-3 file:border file:border-terra/30 file:bg-terra/20 file:text-sand/80 file:font-body file:text-xs file:uppercase file:tracking-widest hover:file:bg-terra/30 transition-all w-full"
            />
            {imageUploading && <p className="font-body text-xs text-sand/40 mt-1 animate-pulse">Uploading...</p>}
          </div>
        </div>
        <Input
          label="Or paste image URL"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://... (leave blank to use placeholder)"
        />
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="w-5 h-5 accent-terra"
        />
        <span className="font-body text-sm text-sand/80 uppercase tracking-wider">
          Feature on homepage
        </span>
      </label>

      {error && <p className="font-body text-sm text-red-400 bg-red-900/20 border border-red-500/30 p-3">{error}</p>}
      {success && <p className="font-body text-sm text-green-400 bg-green-900/20 border border-green-500/30 p-3">{success}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={loading || imageUploading} className="btn-stamp px-8 py-3 text-sm disabled:opacity-50">
          {loading ? 'Saving...' : mode === 'create' ? '+ Create Product' : '✓ Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="font-body text-sm text-sand/50 hover:text-gold border border-terra/20 px-6 py-3 uppercase tracking-widest transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
