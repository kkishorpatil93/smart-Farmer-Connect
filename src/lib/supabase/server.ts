import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-smart-farmer.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase client with elevated privileges for admin tasks and audit logging.
 * NEVER import this into client components.
 */
export function createServerAdminClient() {
  if (!supabaseServiceRoleKey) {
    console.warn(
      '⚠️ SUPABASE_SERVICE_ROLE_KEY is not defined. Operating with mock or restricted admin access.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey || 'mock-service-role-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
