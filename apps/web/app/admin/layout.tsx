import { InternalNav } from "@/components/layout/internal-nav";
import { Notice } from "@/components/ui/notice";
import { adminNavigation } from "@/lib/constants/navigation";
import { requireAdmin } from "@/services/auth.service";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = await requireAdmin("/admin");

  return (
    <div className="shell pb-20 pt-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">Admin</p>
          <h1 className="text-4xl">Content operations</h1>
          <p className="section-copy">
            Admin routes exist early so roles, policies, and content workflows stay aligned with the product.
          </p>
        </div>
        {!authContext.isConfigured ? (
          <Notice>
            Supabase auth is not configured yet. Add the environment variables to enforce admin access by role.
          </Notice>
        ) : null}
        <InternalNav items={adminNavigation} />
        {children}
      </div>
    </div>
  );
}
