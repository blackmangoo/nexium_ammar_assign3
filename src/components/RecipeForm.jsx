// src/components/RecipeForm.jsx
'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

export function RecipeForm({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim() || isLoading) return
    onGenerate(prompt)
    setPrompt('')
  }

  return (
    <Card className="mb-10 border-emerald-900/50 bg-black/30 backdrop-blur-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="text-emerald-300">Create a new recipe</CardTitle>
        <CardDescription>Enter your ingredients and the AI will do the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="prompt">Your Ingredients</Label>
            <Textarea
              id="prompt"
              className="min-h-[80px] bg-transparent focus:ring-1 focus:ring-emerald-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., chicken breast, rice, broccoli, soy sauce"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full font-semibold text-primary-foreground transition-all bg-[linear-gradient(to_right,theme(colors.emerald.500),theme(colors.emerald.400),theme(colors.sky.500),theme(colors.emerald.400),theme(colors.emerald.500))] bg-[length:200%_auto] animate-background-pan hover:opacity-90 sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            {isLoading ? 'Generating...' : 'Generate Recipe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}