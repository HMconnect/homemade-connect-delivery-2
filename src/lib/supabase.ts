import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing — check your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://veuqupdtxsmneuewfrze.supabase.co',
  supabaseKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Test connection helper
export const testConnection = async () => {
  const { data, error } = await supabase
    .from('app_counters')
    .select('*')
    .limit(1);
  if (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
  console.log('✅ Supabase connected successfully');
  return true;
};
