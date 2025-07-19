import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { prompt } = await request.json()
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // 1. Get the current user session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // 2. Insert a new record into the recipes table with 'processing' status
  // This is what triggers the real-time update on the frontend.
  const { data, error } = await supabase
    .from('recipes')
    .insert({ user_id: session.user.id, prompt: prompt, status: 'processing' })
    .select()
    .single()

  if (error) {
    console.error('Supabase Insert Error:', error.message)
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  }

  const recipeId = data.id

  // 3. Trigger the n8n workflow asynchronously (fire and forget)
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
  if (n8nWebhookUrl) {
    fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, prompt })
    }).catch(err => console.error("N8N Webhook Call Error:", err))
  } else {
    console.warn("N8N_WEBHOOK_URL is not set in .env.local")
  }

  // 4. Respond to the client immediately with a 202 Accepted status
  return new NextResponse(JSON.stringify({ message: "Request accepted", recipeId: recipeId }), { status: 202 })
}