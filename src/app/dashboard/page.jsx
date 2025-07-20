// src/app/dashboard/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const checkUserAndGetRecipes = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
      if (data) setRecipes(data)
    }
    checkUserAndGetRecipes()
  }, [])

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('realtime recipes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, async () => {
        const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
        if (data) setRecipes(data)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    setLoading(true)
    await fetch('/api/generate-recipe', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' },
    })
    setPrompt('')
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Recipe Generator</h1>
          <button onClick={handleLogout} className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600">
            Logout
          </button>
        </header>
        <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
          <form onSubmit={handleGenerate}>
            <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-gray-300">
              What ingredients do you have?
            </label>
            <textarea
              id="prompt"
              rows="3"
              className="w-full rounded-md bg-gray-200 p-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
            />
            <button type="submit" disabled={loading} className="mt-4 w-full rounded-md bg-indigo-600 px-6 py-2 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
              {loading ? 'Requesting...' : '✨ Generate Recipe'}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Generated Recipes</h2>
          {recipes.length === 0 && <p className="text-center text-gray-500">No recipes generated yet.</p>}
          {recipes.map((recipe) => (
            <div key={recipe.id} className="rounded-lg bg-gray-800 p-6 shadow-lg">
              {recipe.status === 'processing' ? (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-400"></div>
                  <span className="text-gray-400">AI is thinking about: "{recipe.prompt}"</span>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-indigo-400">{recipe.title || 'Untitled'}</h3>
                  <p className="mt-2 whitespace-pre-wrap text-gray-300">{recipe.instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}