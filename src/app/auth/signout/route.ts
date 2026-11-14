import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Server-side signout handler. Revokes the Supabase session
 * and deletes all authentication cookies.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const { origin } = new URL(request.url);
  const response = NextResponse.redirect(`${origin}/admin/login`, { status: 302 });

  response.cookies.delete("faras_admin_session");

  return response;
}
