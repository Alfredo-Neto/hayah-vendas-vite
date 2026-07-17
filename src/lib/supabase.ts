import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';
import type { Database } from './database.types';

const env = getSupabaseEnv();

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
