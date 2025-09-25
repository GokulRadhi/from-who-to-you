import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'MISSING')
  console.error('VITE_SUPABASE_KEY:', supabaseKey ? 'PRESENT' : 'MISSING')
  throw new Error('Supabase configuration is missing. Check your .env file.')
}

console.log('🔧 Supabase Client Initialized:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})