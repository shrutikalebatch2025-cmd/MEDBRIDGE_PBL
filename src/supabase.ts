import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://udmhtfsrszntxnfrgowl.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_MkD9cGx_oldaV1RUJDk3dA_v-v0w4yJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
