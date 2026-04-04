import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/auth-forms";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { getAuthContext } from "@/services/auth.service";
import { readFirstSearchParam, type SearchParamsRecord } from "@findy/shared/utils/url";

type ResetPasswordPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = (searchParams ? await searchParams : undefined) ?? {};
  const authContext = await getAuthContext();
  const error = readFirstSearchParam(resolvedSearchParams.error);
  const message = readFirstSearchParam(resolvedSearchParams.message);

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md rounded-[2rem] border-foreground/10 bg-white/75">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle>Choose a new password</CardTitle>
            <CardDescription>
              Finish the recovery flow here after opening the link from your email.
            </CardDescription>
          </div>
          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}
          {!authContext.isConfigured ? (
            <Notice>Add Supabase environment variables before using password recovery.</Notice>
          ) : null}
          {authContext.isConfigured && !authContext.user ? (
            <Notice>
              Open the reset link from your email first. If the link expired, request a new one.
            </Notice>
          ) : (
            <ResetPasswordForm />
          )}
          <Link href="/forgot-password" className="text-sm font-medium text-brand">
            Request another reset link
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
