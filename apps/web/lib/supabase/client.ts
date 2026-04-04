import { createBrowserClient } from "@supabase/ssr";

import { supabaseAnonKey, supabaseUrl, hasSupabaseCredentials } from "@/lib/supabase/env";
import { type Database } from "@findy/shared/database";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseCredentials) {
    throw new Error("Missing Supabase browser credentials.");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
