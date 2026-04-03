import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { supabaseAnonKey, supabaseUrl, hasSupabaseCredentials } from "@/lib/supabase/env";
import { type Database } from "@/types/database";

export async function createServerSupabaseClient() {
  if (!hasSupabaseCredentials) {
    throw new Error("Missing Supabase server credentials.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot write cookies. Middleware handles refresh there.
        }
      }
    }
  });
}
