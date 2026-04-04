"use client";

import { useActionState, useState } from "react";

import {
  forgotPasswordAction,
  type ForgotPasswordActionState,
  type ResetPasswordActionState,
  signInAction,
  type SignInActionState,
  signUpAction,
  type SignUpActionState,
  updatePasswordAction
} from "@/app/(auth)/actions";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { cn } from "@/lib/utils/cn";

type LoginFormProps = {
  next: string;
};

type RegisterFormProps = {
  next: string;
};

const initialSignInState: SignInActionState = {
  status: "idle"
};

const initialSignUpState: SignUpActionState = {
  status: "idle"
};

const initialForgotPasswordState: ForgotPasswordActionState = {
  status: "idle"
};

const initialResetPasswordState: ResetPasswordActionState = {
  status: "idle"
};

function fieldInputClass(error?: string) {
  return error ? "border-red-300 focus:border-red-500" : "";
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function hasFieldErrors(fieldErrors?: Record<string, string | undefined>) {
  return Object.values(fieldErrors ?? {}).some(Boolean);
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction] = useActionState(signInAction, initialSignInState);
  const [values, setValues] = useState({
    email: "",
    password: ""
  });

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Email</span>
        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
          className={fieldInputClass(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Password</span>
        <Input
          type="password"
          name="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          className={fieldInputClass(state.fieldErrors?.password)}
        />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      {state.error && !hasFieldErrors(state.fieldErrors) ? <Notice tone="error">{state.error}</Notice> : null}
      <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
        Continue
      </button>
    </form>
  );
}

export function RegisterForm({ next }: RegisterFormProps) {
  const [state, formAction] = useActionState(signUpAction, initialSignUpState);
  const [values, setValues] = useState({
    confirmPassword: "",
    email: "",
    fullName: "",
    password: ""
  });

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-2 sm:col-span-2">
        <span className="text-sm font-medium text-foreground/75">Full name</span>
        <Input
          name="fullName"
          value={values.fullName}
          onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))}
          placeholder="Full name"
          className={fieldInputClass(state.fieldErrors?.fullName)}
        />
        <FieldError message={state.fieldErrors?.fullName} />
      </label>
      <label className="block space-y-2 sm:col-span-2">
        <span className="text-sm font-medium text-foreground/75">Email</span>
        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email address"
          className={fieldInputClass(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Password</span>
        <Input
          type="password"
          name="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          className={fieldInputClass(state.fieldErrors?.password)}
        />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Confirm password</span>
        <Input
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(event) => setValues((current) => ({ ...current, confirmPassword: event.target.value }))}
          placeholder="Confirm password"
          className={fieldInputClass(state.fieldErrors?.confirmPassword)}
        />
        <FieldError message={state.fieldErrors?.confirmPassword} />
      </label>
      {state.error && !hasFieldErrors(state.fieldErrors) ? <Notice tone="error">{state.error}</Notice> : null}
      <button type="submit" className={buttonVariants({ variant: "primary", className: "sm:col-span-2" })}>
        Create account
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialForgotPasswordState);
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Email</span>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className={fieldInputClass(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      {state.error && !hasFieldErrors(state.fieldErrors) ? <Notice tone="error">{state.error}</Notice> : null}
      <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
        Send reset link
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(updatePasswordAction, initialResetPasswordState);
  const [values, setValues] = useState({
    confirmPassword: "",
    password: ""
  });

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">New password</span>
        <Input
          type="password"
          name="password"
          value={values.password}
          onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
          placeholder="New password"
          className={fieldInputClass(state.fieldErrors?.password)}
        />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground/75">Confirm new password</span>
        <Input
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(event) => setValues((current) => ({ ...current, confirmPassword: event.target.value }))}
          placeholder="Confirm new password"
          className={fieldInputClass(state.fieldErrors?.confirmPassword)}
        />
        <FieldError message={state.fieldErrors?.confirmPassword} />
      </label>
      {state.error && !hasFieldErrors(state.fieldErrors) ? <Notice tone="error">{state.error}</Notice> : null}
      <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
        Update password
      </button>
    </form>
  );
}
