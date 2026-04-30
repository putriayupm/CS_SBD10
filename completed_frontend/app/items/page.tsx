'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = 'http://localhost:3000'

interface Item {
  id: number
  name: string
  price: number
  stock: number
}

function formatRupiah(num: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

export default function ItemsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Item | null>(null)
  const [form, setForm] = useState({ name: '', price: '', stock: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/items`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to fetch items')
      setItems(data.payload)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ name: '', price: '', stock: '' })
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (item: Item) => {
    setEditItem(item)
    setForm({ name: item.name, price: String(item.price), stock: String(item.stock) })
    setFormError('')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    const body = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    }
    try {
      const url = editItem ? `${API_URL}/items/${editItem.id}` : `${API_URL}/items`
      const method = editItem ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to save item')
      setShowModal(false)
      fetchItems()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#fdf6f8] text-[#2d1a20]">
      <div className="bg-white border-b border-[#f9d0dc] px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-[#e8637e]">putty.shop</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="bg-[#e8637e] text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            + Add Item
          </button>
          <button
            onClick={handleLogout}
            className="text-[#b07080] text-sm hover:text-[#e8637e] transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading && <p className="text-[#b07080] text-center">Loading items...</p>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-[#b07080] text-center">No items found. Add one!</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#f9d0dc] rounded-2xl p-6 flex flex-col gap-3 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#2d1a20]">{item.name}</h2>
              <p className="text-[#e8637e] font-bold text-xl">{formatRupiah(item.price)}</p>
              <p className="text-[#b07080] text-sm">Stock: {item.stock}</p>
              <button
                onClick={() => openEdit(item)}
                className="mt-auto text-sm border border-[#f9d0dc] text-[#b07080] hover:border-[#e8637e] hover:text-[#e8637e] rounded-xl py-2 transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#f9d0dc] rounded-2xl p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-[#2d1a20] mb-6">
              {editItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Item Name', name: 'name', type: 'text', placeholder: 'e.g. Laptop' },
                { label: 'Price (IDR)', name: 'price', type: 'number', placeholder: '50000' },
                { label: 'Stock', name: 'stock', type: 'number', placeholder: '10' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-semibold text-[#b07080] uppercase tracking-widest mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-[#fdf6f8] border border-[#f9d0dc] rounded-xl px-4 py-3 text-[#2d1a20] text-sm outline-none focus:border-[#e8637e] transition"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-[#f9d0dc] text-[#b07080] py-3 rounded-xl hover:border-[#e8637e] hover:text-[#e8637e] transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#e8637e] text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Saving...' : editItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}