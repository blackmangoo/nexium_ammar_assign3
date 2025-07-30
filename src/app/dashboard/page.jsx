'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSupabase } from '@/hooks/useSupabase'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeForm } from '@/components/RecipeForm'
import { Button } from "@/components/ui/button"
import { Bot, LogOut } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    const checkUserAndGetRecipes = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
      if (data) setRecipes(data)
    }
    checkUserAndGetRecipes()
  }, [router, supabase])

  useEffect(() => {
    if (!user) return
    const channel = supabase.channel('realtime recipes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes' }, async () => {
        const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false })
        if (data) setRecipes(data)
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, supabase])

  // This function sends the POST request
  const handleGenerate = useCallback(async (prompt) => {
    setLoading(true)
    await fetch('/api/generate-recipe', {
      method: 'POST', // <-- Correct method is used here
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <video autoPlay muted loop className="background-video">
        <source src="/dashboard-video.mp4" type="video/mp4" />
      </video>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl"
      >
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-emerald-400" />
            <h1 className="text-3xl font-bold tracking-tighter">AI Recipe Generator</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </header>

        <RecipeForm onGenerate={handleGenerate} isLoading={loading} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tighter">Your Generated Recipes</h2>
          {recipes.length === 0 && (
            <div className="text-center py-10 rounded-lg border-2 border-dashed border-emerald-900/50 bg-black/20 backdrop-blur-sm">
              <p className="text-muted-foreground">No recipes generated yet.</p>
            </div>
          )}
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}