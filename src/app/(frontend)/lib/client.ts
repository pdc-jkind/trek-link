// src/lib/supabase/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client components (browser) - this is safe to import in client components
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Export types
export type { User } from '@supabase/supabase-js'