import { type NextRequest, NextResponse } from "next/server";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath, withQuery } from "@/lib/utils/url";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = sanitizeRedirectPath(requestUrl.searchParams.get("next"), "/dashboard");

  if (!hasSupabaseCredentials) {
    return NextResponse.redirect(
      new URL(
        withQuery("/login", {
          error: "Add Supabase environment variables to enable authentication."
        }),
        requestUrl.origin
      )
    );
  }

  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL(
      withQuery("/login", {
        error: "Authentication link is invalid or has expired."
      }),
      requestUrl.origin
    )
  );
}
