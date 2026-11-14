import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a client-side Supabase client.
 * Returns null or a dummy client if environment variables are not yet configured,
 * preventing build breaks or runtime crashes before credentials are supplied.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder-project")) {
    // Return mock client to allow clean visual development without active credentials
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

