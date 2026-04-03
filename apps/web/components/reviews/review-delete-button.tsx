"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

import { deleteReviewAction, type ReviewActionState } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type ReviewDeleteButtonProps = {
  compact?: boolean;
  reviewId: string;
  returnTo: string;
};

const initialState: ReviewActionState = {
  status: "idle"
};

function ReviewDeleteSubmitButton({ compact = false }: { compact?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      className={cn(
        "border border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
        compact ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm"
      )}
    >
      {pending ? "Removing..." : "Delete"}
    </Button>
  );
}

export function ReviewDeleteButton({ reviewId, returnTo, compact = false }: ReviewDeleteButtonProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteReviewAction, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status, state.reviewCount, state.averageRating]);

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="reviewId" value={reviewId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <ReviewDeleteSubmitButton compact={compact} />
      </form>
      {state.status === "error" && state.message ? (
        <p className="text-xs leading-5 text-red-700">{state.message}</p>
      ) : null}
    </div>
  );
}
