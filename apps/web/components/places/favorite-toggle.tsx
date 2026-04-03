"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { toggleFavoriteAction, type FavoriteActionState } from "@/app/actions/favorites";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type FavoriteToggleProps = {
  placeId: string;
  returnTo: string;
  initialIsFavorited: boolean;
  isConfigured: boolean;
  isAuthenticated: boolean;
  compact?: boolean;
};

const initialState: FavoriteActionState = {
  status: "idle"
};

function FavoriteSubmitButton({
  isFavorited,
  compact = false
}: {
  isFavorited: boolean;
  compact?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={isFavorited ? "secondary" : "ghost"}
      className={cn("border border-foreground/10 bg-white/90 backdrop-blur", compact && "h-9 px-4 text-xs")}
      aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
    >
      {pending ? "Saving..." : isFavorited ? "Saved" : "Save"}
    </Button>
  );
}

export function FavoriteToggle({
  placeId,
  returnTo,
  initialIsFavorited,
  isConfigured,
  isAuthenticated,
  compact = false
}: FavoriteToggleProps) {
  const [state, formAction] = useActionState(toggleFavoriteAction, initialState);
  const isFavorited = state.isFavorited ?? initialIsFavorited;
  const loginHref = `/login?${new URLSearchParams({ next: returnTo }).toString()}`;

  if (!isConfigured) {
    return (
      <span className="rounded-full border border-foreground/10 bg-white/85 px-4 py-2 text-xs text-foreground/55">
        Auth setup required
      </span>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={loginHref}
        className={cn(
          buttonVariants({
            variant: "ghost"
          }),
          "border border-foreground/10 bg-white/90 backdrop-blur",
          compact && "h-9 px-4 text-xs"
        )}
      >
        Sign in to save
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <FavoriteSubmitButton isFavorited={isFavorited} compact={compact} />
      </form>
      {state.status === "error" && state.message ? (
        <p className="max-w-48 text-xs leading-5 text-red-700">{state.message}</p>
      ) : null}
    </div>
  );
}
