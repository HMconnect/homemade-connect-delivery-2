import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasCredentials = Boolean(supabaseUrl && supabaseKey);

if (!hasCredentials) {
  console.warn('Supabase credentials missing — check your .env file');
}

export const supabase = createClient(
  supabaseUrl || 'https://veuqupdtxsmneuewfrze.supabase.co',
  supabaseKey || 'placeholder-key-for-initialization',
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

export const isSupabaseConfigured = hasCredentials;

export const testConnection = async () => {
  if (!hasCredentials) {
    console.error('Supabase credentials missing — check your .env file');
    return false;
  }
  const { data, error } = await supabase
    .from('app_counters')
    .select('*')
    .limit(1);
  if (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
  console.log('Supabase connected successfully');
  return true;
};
