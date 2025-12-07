import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bajfeaznpzgctdhfbtkg.supabase.co'
const supabaseAnonKey = 'sb_publishable_SG6be8-hXaq9m3i4cLk_KQ_r9mnP5Nx'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
