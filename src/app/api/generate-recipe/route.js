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
    console.error('Supabase insert error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to create recipe' }), { status: 500 })
  }

  // This section is updated to log the result
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (n8nWebhookUrl) {
    console.log("Calling n8n webhook:", n8nWebhookUrl);
    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: data.id, prompt })
      });
      console.log("n8n response status:", n8nResponse.status);
    } catch (e) {
      console.error("CRITICAL: Error calling n8n webhook:", e);
    }
  } else {
    console.log("N8N_WEBHOOK_URL not set.");
  }

  return new NextResponse(JSON.stringify({ recipeId: data.id }), { status: 202 })
}