// src/lib/supabase/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validasi environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL dan Anon Key harus dikonfigurasi dalam environment variables"
  );
}

// Client utama untuk aplikasi dengan auth
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
});

// Admin client untuk operasi server-side (opsional)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Export types untuk TypeScript
export type { Database } from "@/types/database";