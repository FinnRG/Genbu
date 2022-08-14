import { createClient } from '@supabase/supabase-js'

const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY ?? ''
const url = process.env.NODE_ENV === 'development' ? 'http://localhost:54321' : process.env.REACT_APP_SUPABASE_URL ?? ''

export default createClient(url, anonKey)
