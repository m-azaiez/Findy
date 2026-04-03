import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/app/(auth)/actions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import {
  readFirstSearchParam,
  sanitizeRedirectPath,
  type SearchParamsRecord
} from "@/lib/utils/url";
import { getAuthContext } from "@/services/auth.service";

type LoginPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
      <Card className="w-full max-w-md rounded-[2rem] border-foreground/10 bg-white/75">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use your Supabase-backed account to access saved places, reviews, and protected routes.
            </CardDescription>
          </div>
          {error ? <Notice tone="error">{error}</Notice> : null}
          {message ? <Notice tone="success">{message}</Notice> : null}
          {!authContext.isConfigured ? (
            <Notice>Add Supabase environment variables to turn authentication on for this workspace.</Notice>
          ) : null}
          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <Input type="email" name="email" placeholder="Email address" />
            <Input type="password" name="password" placeholder="Password" />
            <button type="submit" className={buttonVariants({ variant: "primary", className: "w-full" })}>
              Continue
            </button>
          </form>
          <div className="flex items-center justify-between text-sm text-foreground/60">
            <Link href="/forgot-password">Forgot password</Link>
            <Link href={`/register?next=${encodeURIComponent(next)}`}>Create account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
