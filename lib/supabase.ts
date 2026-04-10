import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  if (!_client) _client = createClient(url, key)
  return _client
}

// Keep named export for backwards compat with spec — resolves lazily
export const supabase = {
  from: (table: string) => getSupabase()?.from(table) ?? { select: () => Promise.resolve({ data: null, error: null }) },
}
