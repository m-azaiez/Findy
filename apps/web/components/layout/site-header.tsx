import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";
import { buttonVariants } from "@/components/ui/button";
import { mainNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import { getAuthContext } from "@/services/auth.service";

export async function SiteHeader() {
  const authContext = await getAuthContext();
  const identityLabel =
    authContext.profile?.full_name ?? authContext.profile?.username ?? authContext.user?.email ?? "Account";

  const navigation = mainNavigation.filter((item) => {
    if (item.href === "/dashboard") {
      return Boolean(authContext.user) || !authContext.isConfigured;
    }

    if (item.href === "/admin") {
      return authContext.profile?.role === "admin" || !authContext.isConfigured;
    }

    return true;
  });

  return (
    <header className="shell sticky top-0 z-30 pt-4">
      <div className="glass-panel flex items-center justify-between rounded-full px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
            F
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/50">Findy</p>
            <p className="font-medium">Curated discovery</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-foreground/70 transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {authContext.user ? (
            <>
              <span className="hidden text-sm text-foreground/60 sm:inline">{identityLabel}</span>
              <form action={signOutAction}>
                <button type="submit" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
                  Sign out
                </button>
              </form>
              <Link href="/dashboard" className={buttonVariants({ variant: "primary" })}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}>
                Sign in
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "primary" })}>
                Join now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
