import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-safe Supabase client using @supabase/ssr.
 * Returns null if placeholder credentials are used, allowing
 * visual local development and demo fallbacks.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder-project") ||
    supabaseAnonKey.includes("placeholder")
  ) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
