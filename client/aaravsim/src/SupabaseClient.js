import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
// console.log(import.meta.env.VITE_SUPABASE_URL)
// console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
export default supabase