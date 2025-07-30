import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { prompt } = await request.json()
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { data, error } = await supabase
    .from('recipes')
    .insert({ user_id: session.user.id, prompt: prompt, status: 'processing' })
    .select()
    .single()

  if (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to create recipe' }), { status: 500 })
  }

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nWebhookUrl) {
    fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: data.id, prompt })
    }).catch(err => console.error("N8N Webhook Call Error:", err));
  }

  return new NextResponse(JSON.stringify({ recipeId: data.id }), { status: 202 })
}

{ }