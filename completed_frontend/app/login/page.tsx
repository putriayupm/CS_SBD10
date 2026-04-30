'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_URL = 'http://localhost:3000'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.payload.token)
      localStorage.setItem('user', JSON.stringify(data.payload.user))
      router.push('/items')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdf6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#f9d0dc] rounded-2xl p-10 shadow-sm">
        <h1 className="text-3xl font-bold text-[#2d1a20] mb-1">Welcome back</h1>
        <p className="text-[#b07080] text-sm mb-8">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#e8637e] font-medium hover:underline">
            Register here
          </Link>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#b07080] uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              className="w-full bg-[#fdf6f8] border border-[#f9d0dc] rounded-xl px-4 py-3 text-[#2d1a20] text-sm outline-none focus:border-[#e8637e] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#b07080] uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              className="w-full bg-[#fdf6f8] border border-[#f9d0dc] rounded-xl px-4 py-3 text-[#2d1a20] text-sm outline-none focus:border-[#e8637e] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8637e] text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}