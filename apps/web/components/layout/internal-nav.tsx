"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

type InternalNavItem = {
  href: string;
  label: string;
};

type InternalNavProps = {
  items: InternalNavItem[];
};

export function InternalNav({ items }: InternalNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              isActive
                ? "border-brand bg-brand text-brand-foreground"
                : "border-foreground/10 bg-white/70 text-foreground/70 hover:border-brand/30 hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
