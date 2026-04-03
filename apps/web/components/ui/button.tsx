import { forwardRef } from "react";
import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "lg";

type ButtonOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-foreground hover:bg-brand/90",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/90",
  ghost: "bg-transparent text-foreground/80 hover:bg-foreground/5"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm"
};

export function buttonVariants({
  variant = "primary",
  size = "default",
  className
}: ButtonOptions = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & ButtonOptions>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
  }
);

Button.displayName = "Button";
