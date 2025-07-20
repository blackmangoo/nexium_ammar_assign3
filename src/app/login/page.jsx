'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    if (error) { setMessage(`Error: ${error.message}`) } 
    else { setMessage('Check your email for the magic link!') }
    setLoading(false)
  }
  return (
    // The "bg-background" class has been removed from this div
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-sm border-emerald-900/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl tracking-tighter">AI Recipe Generator</CardTitle>
            <CardDescription>Enter your email to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <Button
                type="submit" className="w-full font-semibold text-primary-foreground transition-all bg-[linear-gradient(to_right,theme(colors.emerald.500),theme(colors.emerald.400),theme(colors.sky.500),theme(colors.emerald.400),theme(colors.emerald.500))] bg-[length:200%_auto] animate-background-pan hover:opacity-90"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}