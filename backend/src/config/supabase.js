import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
supabase
  .from('rooms')
  .select('count')
  .limit(1)
  .then(() => console.log('✓ Supabase connected'))
  .catch((err) => console.error('✗ Supabase connection failed:', err.message))
