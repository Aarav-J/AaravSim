import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://vnhltjxebvjopqujnjww.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGx0anhlYnZqb3BxdWpuand3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxOTc5MzIsImV4cCI6MjA1NTc3MzkzMn0.JJbvF85VpeV5RywBaxmrYWKUAIlg2efHIeMq1YeJ9p8')
export default supabase