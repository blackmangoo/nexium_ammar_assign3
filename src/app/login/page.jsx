// src/app/login/page.jsx
'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm rounded-lg bg-gray-800 p-8 shadow-md">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">AI Recipe Generator</h1>
          <p className="text-gray-400">Enter your email to get started</p>
        </div>
        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          <div>
            <input
              id="email"
              className="w-full rounded-md border-gray-600 bg-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  )
}