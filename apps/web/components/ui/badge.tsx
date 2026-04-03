import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent";
};

export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "accent" ? "bg-accent/20 text-foreground" : "bg-brand-soft text-foreground/80",
        className
      )}
    >
      {children}
    </span>
  );
}
