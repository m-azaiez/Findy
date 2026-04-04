"use server";

import { redirect } from "next/navigation";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { getSiteUrl } from "@/lib/utils/url.server";
import { sanitizeRedirectPath, withQuery } from "@findy/shared/utils/url";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema
} from "@findy/shared/validations/auth";
import {
  sendPasswordResetEmail,
  signInWithPassword,
  signOutCurrentUser,
  signUpWithPassword,
  updatePassword
} from "@/services/auth.service";

type SignInFieldErrors = {
  email?: string;
  password?: string;
};

type SignUpFieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

type ForgotPasswordFieldErrors = {
  email?: string;
};

type ResetPasswordFieldErrors = {
  password?: string;
  confirmPassword?: string;
};

export type SignInActionState = {
  error?: string;
  fieldErrors?: SignInFieldErrors;
  status: "idle" | "error";
};

export type SignUpActionState = {
  error?: string;
  fieldErrors?: SignUpFieldErrors;
  status: "idle" | "error";
};

export type ForgotPasswordActionState = {
  error?: string;
  fieldErrors?: ForgotPasswordFieldErrors;
  status: "idle" | "error";
};

export type ResetPasswordActionState = {
  error?: string;
  fieldErrors?: ResetPasswordFieldErrors;
  status: "idle" | "error";
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getFirstFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, value]) => Boolean(value?.[0]))
      .map(([key, value]) => [key, value?.[0]])
  ) as Record<string, string>;
}

function toSignInErrorState(error?: string, fieldErrors?: SignInFieldErrors): SignInActionState {
  return {
    error,
    fieldErrors,
    status: "error"
  };
}

function toSignUpErrorState(error?: string, fieldErrors?: SignUpFieldErrors): SignUpActionState {
  return {
    error,
    fieldErrors,
    status: "error"
  };
}

function toForgotPasswordErrorState(
  error?: string,
  fieldErrors?: ForgotPasswordFieldErrors
): ForgotPasswordActionState {
  return {
    error,
    fieldErrors,
    status: "error"
  };
}

function toResetPasswordErrorState(error?: string, fieldErrors?: ResetPasswordFieldErrors): ResetPasswordActionState {
  return {
    error,
    fieldErrors,
    status: "error"
  };
}

export async function signInAction(
  _previousState: SignInActionState,
  formData: FormData
): Promise<SignInActionState> {
  const next = sanitizeRedirectPath(getFormValue(formData, "next"), "/dashboard");

  if (!hasSupabaseCredentials) {
    return toSignInErrorState("Add Supabase environment variables to enable authentication.");
  }

  const parsed = signInSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password")
  });

  if (!parsed.success) {
    return toSignInErrorState(
      parsed.error.issues[0]?.message ?? "Enter a valid email and password.",
      getFirstFieldErrors(parsed.error.flatten().fieldErrors) as SignInFieldErrors
    );
  }

  const { error } = await signInWithPassword(parsed.data);

  if (error) {
    return toSignInErrorState(error.message);
  }

  redirect(next);
}

export async function signUpAction(
  _previousState: SignUpActionState,
  formData: FormData
): Promise<SignUpActionState> {
  const next = sanitizeRedirectPath(getFormValue(formData, "next"), "/dashboard");

  if (!hasSupabaseCredentials) {
    return toSignUpErrorState("Add Supabase environment variables to enable authentication.");
  }

  const parsed = signUpSchema.safeParse({
    fullName: getFormValue(formData, "fullName"),
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword")
  });

  if (!parsed.success) {
    return toSignUpErrorState(
      parsed.error.issues[0]?.message ?? "Complete the form and try again.",
      getFirstFieldErrors(parsed.error.flatten().fieldErrors) as SignUpFieldErrors
    );
  }

  const baseUrl = await getSiteUrl();
  const { data, error } = await signUpWithPassword(
    parsed.data,
    `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`
  );

  if (error) {
    return toSignUpErrorState(error.message);
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

export async function forgotPasswordAction(
  _previousState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  if (!hasSupabaseCredentials) {
    return toForgotPasswordErrorState("Add Supabase environment variables before using password recovery.");
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: getFormValue(formData, "email")
  });

  if (!parsed.success) {
    return toForgotPasswordErrorState(
      parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      getFirstFieldErrors(parsed.error.flatten().fieldErrors) as ForgotPasswordFieldErrors
    );
  }

  const baseUrl = await getSiteUrl();
  const { error } = await sendPasswordResetEmail(parsed.data, `${baseUrl}/auth/callback?next=/reset-password`);

  if (error) {
    return toForgotPasswordErrorState(error.message);
  }

  redirect(
    withQuery("/forgot-password", {
      message: "A password reset link has been sent if the account exists."
    })
  );
}

export async function updatePasswordAction(
  _previousState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  if (!hasSupabaseCredentials) {
    return toResetPasswordErrorState("Add Supabase environment variables before using password recovery.");
  }

  const parsed = resetPasswordSchema.safeParse({
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword")
  });

  if (!parsed.success) {
    return toResetPasswordErrorState(
      parsed.error.issues[0]?.message ?? "Enter a valid password.",
      getFirstFieldErrors(parsed.error.flatten().fieldErrors) as ResetPasswordFieldErrors
    );
  }

  const { error } = await updatePassword(parsed.data);

  if (error) {
    return toResetPasswordErrorState(error.message);
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
