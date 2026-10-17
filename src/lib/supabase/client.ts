import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-smart-farmer.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key-for-local-dev';

/**
 * Supabase client for use in browser components
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
