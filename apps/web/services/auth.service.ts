import { type User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput
} from "@/lib/validations/auth";
import { sanitizeRedirectPath, withQuery } from "@/lib/utils/url";
import { type Database } from "@/types/database";

type ProfileSummary = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "full_name" | "username" | "role"
>;

export type AuthContext = {
  isConfigured: boolean;
  user: User | null;
  profile: ProfileSummary | null;
};

export async function getAuthContext(): Promise<AuthContext> {
  if (!hasSupabaseCredentials) {
    return {
      isConfigured: false,
      user: null,
      profile: null
    };
  }

  const client = await createServerSupabaseClient();
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    return {
      isConfigured: true,
      user: null,
      profile: null
    };
  }

  const { data: profile } = await client
    .from("profiles")
    .select("id, full_name, username, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    isConfigured: true,
    user,
    profile: profile ?? null
  };
}

export async function requireUser(redirectTo = "/dashboard"): Promise<AuthContext> {
  const authContext = await getAuthContext();

  if (!authContext.isConfigured) {
    return authContext;
  }

  if (!authContext.user) {
    redirect(
      withQuery("/login", {
        error: "Sign in to continue.",
        next: sanitizeRedirectPath(redirectTo, "/dashboard")
      })
    );
  }

  return authContext;
}

export async function requireAdmin(redirectTo = "/admin"): Promise<AuthContext> {
  const authContext = await requireUser(redirectTo);

  if (!authContext.isConfigured) {
    return authContext;
  }

  if (authContext.profile?.role !== "admin") {
    redirect(
      withQuery("/dashboard", {
        error: "Your account does not have admin access."
      })
    );
  }

  return authContext;
}

export async function signInWithPassword(credentials: SignInInput) {
  const client = await createServerSupabaseClient();

  return client.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });
}

export async function signUpWithPassword(credentials: SignUpInput, emailRedirectTo: string) {
  const client = await createServerSupabaseClient();

  return client.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName
      },
      emailRedirectTo
    }
  });
}

export async function sendPasswordResetEmail(payload: ForgotPasswordInput, redirectTo: string) {
  const client = await createServerSupabaseClient();

  return client.auth.resetPasswordForEmail(payload.email, {
    redirectTo
  });
}

export async function updatePassword(payload: ResetPasswordInput) {
  const client = await createServerSupabaseClient();

  return client.auth.updateUser({
    password: payload.password
  });
}

export async function signOutCurrentUser() {
  const client = await createServerSupabaseClient();

  return client.auth.signOut();
}
