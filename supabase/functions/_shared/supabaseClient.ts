import { createClient } from 'https://esm.sh/@supabase/supabase-js@rc'
import { Database } from './DatabaseDefinitions.ts'

export const supabaseClient = createClient<Database>(
  // Supabase API URL - env var exported by default when deployed.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API ANON KEY - env var exported by default when deployed.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)