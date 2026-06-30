import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

// Admin client with service_role (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Anonymous client (safe for browser)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
