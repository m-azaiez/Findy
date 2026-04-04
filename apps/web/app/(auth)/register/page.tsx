import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/auth-forms";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import {
  readFirstSearchParam,
  sanitizeRedirectPath,
  type SearchParamsRecord
} from "@/lib/utils/url";
import { getAuthContext } from "@/services/auth.service";

type RegisterPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = (searchParams ? await searchParams : undefined) ?? {};
  const error = readFirstSearchParam(resolvedSearchParams.error);
  const message = readFirstSearchParam(resolvedSearchParams.message);
  const next = sanitizeRedirectPath(readFirstSearchParam(resolvedSearchParams.next), "/dashboard");
  const authContext = await getAuthContext();

  if (authContext.isConfigured && authContext.user) {
    redirect(next);
  }

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-lg rounded-[2rem] border-foreground/10 bg-white/75">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Register with email and password, then land directly in the protected member area.
            </CardDescription>
          </div>
          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}
          {!authContext.isConfigured ? (
            <Notice>Add Supabase environment variables to turn registration on for this workspace.</Notice>
          ) : null}
          <RegisterForm next={next} />
          <p className="text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-brand">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
