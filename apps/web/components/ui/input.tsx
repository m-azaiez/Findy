import { forwardRef } from "react";
import { type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-foreground/10 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-foreground/40 focus:border-brand",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
