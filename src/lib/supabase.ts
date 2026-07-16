import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

const env = getSupabaseEnv();

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
