import Link from "next/link";

import { forgotPasswordAction } from "@/app/(auth)/actions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { readFirstSearchParam, type SearchParamsRecord } from "@/lib/utils/url";
import { getAuthContext } from "@/services/auth.service";

type ForgotPasswordPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const resolvedSearchParams = (searchParams ? await searchParams : undefined) ?? {};
  const error = readFirstSearchParam(resolvedSearchParams.error);
  const message = readFirstSearchParam(resolvedSearchParams.message);
  const authContext = await getAuthContext();

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md rounded-[2rem] border-foreground/10 bg-white/75">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Request a recovery link and finish the reset in the browser.</CardDescription>
          </div>
          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}
          {!authContext.isConfigured ? (
            <Notice>Add Supabase environment variables before using password recovery.</Notice>
          ) : null}
          <form action={forgotPasswordAction} className="space-y-4">
            <Input type="email" name="email" placeholder="Email address" />
            <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
              Send reset link
            </button>
          </form>
          <Link href="/login" className="text-sm font-medium text-brand">
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
