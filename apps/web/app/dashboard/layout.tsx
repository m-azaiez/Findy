import { InternalNav } from "@/components/layout/internal-nav";
import { Notice } from "@/components/ui/notice";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { getAuthContext } from "@/services/auth.service";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContext = await getAuthContext();

  return (
    <div className="shell pb-20 pt-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground/50">Dashboard</p>
          <h1 className="text-4xl">Member space</h1>
          <p className="section-copy">
            Profile, saved places, and review history live here. The structure is ready for protected sessions.
          </p>
        </div>
        {!authContext.isConfigured ? (
          <Notice>
            Supabase auth is not configured yet. Add the environment variables to enable real protection and live
            sessions.
          </Notice>
        ) : null}
        <InternalNav items={dashboardNavigation} />
        {children}
      </div>
    </div>
  );
}
