'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#f9d0dc] rounded-2xl p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-[#2d1a20] mb-1">Create account</h1>
        <p className="text-[#b07080] text-sm mb-8">
          Already have one?{' '}
          <Link href="/login" className="text-[#e8637e] font-medium hover:underline">
            Login here
          </Link>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-pink-50 border border-pink-200 text-[#e8637e] text-sm rounded-xl px-4 py-3 mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Putri Ayu' },
            { label: 'Username', name: 'username', type: 'text', placeholder: 'putay' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'you@email.com' },
            { label: 'Phone', name: 'phone', type: 'text', placeholder: '+62-8387-7123' },
            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••••' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-[#b07080] uppercase tracking-widest mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full bg-[#fdf6f8] border border-[#f9d0dc] rounded-xl px-4 py-3 text-[#2d1a20] text-sm outline-none focus:border-[#e8637e] transition"
              />
            </div>
          ))}
          <p className="text-[#b07080] text-xs">Min. 10 chars, uppercase, lowercase, number & special character</p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8637e] text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}