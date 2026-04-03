import Link from "next/link";

const footerLinks = [
  { label: "Search", href: "/search" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" }
];

export function SiteFooter() {
  return (
    <footer className="shell pb-8 pt-16">
      <div className="rounded-[1.75rem] border border-foreground/10 bg-white/70 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Findy</p>
            <p className="text-sm text-foreground/60">Project foundation built for a Supabase-backed MVP.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-foreground/60">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
