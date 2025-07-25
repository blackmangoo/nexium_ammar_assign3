// src/components/RecipeCard.jsx
'use client'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'

export function RecipeCard({ recipe, index }) {
  // Split the single string of instructions into an array of steps
  const instructionSteps = recipe.instructions ? recipe.instructions.split('\n\n') : [];

  return (
    <motion.div
      key={recipe.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card className="border-emerald-900/50 bg-black/60 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-emerald-400">{recipe.title || 'Untitled Recipe'}</CardTitle>
        </CardHeader>
        <CardContent>
          {recipe.status === 'processing' ? (
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-emerald-400"></div>
              <span className="text-muted-foreground">AI is thinking about: "{recipe.prompt}"</span>
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              {instructionSteps.map((step, i) => (
                <li key={i}>
                  <ReactMarkdown components={{ p: 'span' }}>{step}</ReactMarkdown>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}