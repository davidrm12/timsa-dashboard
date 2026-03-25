import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjlqcysnghrckwpvmlid.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbHFjeXNuZ2hyY2t3cHZtbGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDA3ODIsImV4cCI6MjA4OTk3Njc4Mn0.X7BjI6BN6X-vNXQvq7Q2acX04NXPVlwEfwhWcfSSbhc'

export const supabase = createClient(supabaseUrl, supabaseKey)
