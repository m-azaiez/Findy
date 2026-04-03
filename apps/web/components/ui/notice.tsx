import { cn } from "@/lib/utils/cn";

type NoticeProps = {
  children: React.ReactNode;
  tone?: "info" | "success" | "error";
};

const toneClasses = {
  info: "border-brand/15 bg-brand-soft/70 text-foreground/80",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900"
};

export function Notice({ children, tone = "info" }: NoticeProps) {
  return <div className={cn("rounded-2xl border px-4 py-3 text-sm leading-6", toneClasses[tone])}>{children}</div>;
}
