"use server";

import { redirect } from "next/navigation";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema
} from "@/lib/validations/auth";
import { getSiteUrl } from "@/lib/utils/url.server";
import { sanitizeRedirectPath, withQuery } from "@/lib/utils/url";
import {
  sendPasswordResetEmail,
  signInWithPassword,
  signOutCurrentUser,
  signUpWithPassword,
  updatePassword
} from "@/services/auth.service";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function ensureAuthConfigured(pathname: string) {
  if (!hasSupabaseCredentials) {
    redirect(
      withQuery(pathname, {
        error: "Add Supabase environment variables to enable authentication."
      })
    );
  }
}

export async function signInAction(formData: FormData) {
  const next = sanitizeRedirectPath(getFormValue(formData, "next"), "/dashboard");

  ensureAuthConfigured("/login");

  const parsed = signInSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password")
  });

  if (!parsed.success) {
    redirect(
      withQuery("/login", {
        error: parsed.error.issues[0]?.message ?? "Enter a valid email and password.",
        next
      })
    );
  }

  const { error } = await signInWithPassword(parsed.data);

  if (error) {
    redirect(
      withQuery("/login", {
        error: error.message,
        next
      })
    );
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const next = sanitizeRedirectPath(getFormValue(formData, "next"), "/dashboard");

  ensureAuthConfigured("/register");

  const parsed = signUpSchema.safeParse({
    fullName: getFormValue(formData, "fullName"),
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword")
  });

  if (!parsed.success) {
    redirect(
      withQuery("/register", {
        error: parsed.error.issues[0]?.message ?? "Complete the form and try again.",
        next
      })
    );
  }

  const baseUrl = await getSiteUrl();
  const { data, error } = await signUpWithPassword(
    parsed.data,
    `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`
  );

  if (error) {
    redirect(
      withQuery("/register", {
        error: error.message,
        next
      })
    );
  }

  if (data.session) {
    redirect(next);
  }

  redirect(
    withQuery("/login", {
      message: "Check your email to confirm your account, then sign in.",
      next
    })
  );
}

export async function forgotPasswordAction(formData: FormData) {
  ensureAuthConfigured("/forgot-password");

  const parsed = forgotPasswordSchema.safeParse({
    email: getFormValue(formData, "email")
  });

  if (!parsed.success) {
    redirect(
      withQuery("/forgot-password", {
        error: parsed.error.issues[0]?.message ?? "Enter a valid email address."
      })
    );
  }

  const baseUrl = await getSiteUrl();
  const { error } = await sendPasswordResetEmail(parsed.data, `${baseUrl}/auth/callback?next=/reset-password`);

  if (error) {
    redirect(
      withQuery("/forgot-password", {
        error: error.message
      })
    );
  }

  redirect(
    withQuery("/forgot-password", {
      message: "A password reset link has been sent if the account exists."
    })
  );
}

export async function updatePasswordAction(formData: FormData) {
  ensureAuthConfigured("/reset-password");

  const parsed = resetPasswordSchema.safeParse({
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword")
  });

  if (!parsed.success) {
    redirect(
      withQuery("/reset-password", {
        error: parsed.error.issues[0]?.message ?? "Enter a valid password."
      })
    );
  }

  const { error } = await updatePassword(parsed.data);

  if (error) {
    redirect(
      withQuery("/reset-password", {
        error: error.message
      })
    );
  }

  redirect(
    withQuery("/login", {
      message: "Your password has been updated. Sign in with the new password."
    })
  );
}

export async function signOutAction() {
  if (hasSupabaseCredentials) {
    await signOutCurrentUser();
  }

  redirect(
    withQuery("/login", {
      message: "You have been signed out."
    })
  );
}
