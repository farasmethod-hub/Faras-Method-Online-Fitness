import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Handles Supabase auth session refresh and protected route authorization.
 * Follows official Supabase SSR guidelines:
 * 1. Updates cookies on both request and response.
 * 2. Calls supabase.auth.getUser() to safely validate authentication on server.
 * 3. Enforces protected route gates on /admin and handles redirects.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder-project") &&
    !supabaseAnonKey.includes("placeholder");

  let user = null;

  if (isSupabaseConfigured) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Validates the JWT with Supabase Auth server (do not use getSession for security)
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  }

  const { pathname } = request.nextUrl;

  // Check fallback session cookie (for dev, demo, or transitional access)
  const legacySession = request.cookies.get("faras_admin_session")?.value === "authenticated";
  const isAuthenticated = Boolean(user) || legacySession;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and accessing /admin/login, redirect to /admin/dashboard
  if (pathname === "/admin/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return supabaseResponse;
}
