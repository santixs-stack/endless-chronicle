// ═══════════════════════════════════════════
//  SUPABASE CLIENT
// ═══════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Returns null if Supabase isn't configured yet
// (game works offline with localStorage fallback)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseReady = () => !!supabase;
