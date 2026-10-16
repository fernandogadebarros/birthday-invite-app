import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

/** Admin client bound to the logged-in user's session (RLS applies). */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component: proxy.ts already refreshes the session.
          }
        },
      },
    },
  );
}

/** Returns the admin email when the session belongs to an allowlisted admin. */
export async function getAdminEmail(): Promise<string | null> {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  if (!email) return null;
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin ? email : null;
}
