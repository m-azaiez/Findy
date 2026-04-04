"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { createReviewAction, type ReviewActionState, updateReviewAction } from "@/app/actions/reviews";
import { Button, buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { StarRatingInput } from "@/components/ui/star-rating-input";
import { cn } from "@/lib/utils/cn";
import { type Review } from "@findy/shared/domain";

type ReviewComposerProps = {
  initialReview: Review | null;
  isAuthenticated: boolean;
  isConfigured: boolean;
  placeId: string;
  returnTo: string;
};

const initialState: ReviewActionState = {
  status: "idle"
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-700">{message}</p>;
}

function ReviewSubmitButton({ hasExistingReview }: { hasExistingReview: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit">
      {pending ? "Saving..." : hasExistingReview ? "Update review" : "Publish review"}
    </Button>
  );
}

export function ReviewComposer({
  initialReview,
  isAuthenticated,
  isConfigured,
  placeId,
  returnTo
}: ReviewComposerProps) {
  const router = useRouter();
  const hasExistingReview = Boolean(initialReview);
  const [state, formAction] = useActionState(hasExistingReview ? updateReviewAction : createReviewAction, initialState);
  const [rating, setRating] = useState(initialReview?.rating ?? 5);
  const loginHref = `/login?${new URLSearchParams({ next: returnTo }).toString()}`;

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status, state.reviewId, state.reviewCount, state.averageRating]);

  useEffect(() => {
    setRating(initialReview?.rating ?? 5);
  }, [initialReview?.id, initialReview?.rating]);

  if (!isConfigured) {
    return <Notice tone="info">Review publishing becomes available once Supabase auth is configured.</Notice>;
  }

  if (!isAuthenticated) {
    return (
      <Notice tone="info">
        <span className="mr-2">Sign in to write one review per place, then edit or remove it later.</span>
        <Link href={loginHref} className={buttonVariants({ variant: "ghost" })}>
          Sign in
        </Link>
      </Notice>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl">{hasExistingReview ? "Edit your review" : "Write your review"}</h3>
        <p className="text-sm text-foreground/60">
          {hasExistingReview
            ? "You can update your rating and comment anytime."
            : "You can publish one review for this place, then come back to edit it later."}
        </p>
      </div>

      <form action={formAction} className="space-y-4 rounded-[1.5rem] border border-foreground/10 bg-white/80 p-5">
        <input type="hidden" name="placeId" value={placeId} />
        <input type="hidden" name="returnTo" value={returnTo} />
        {initialReview ? <input type="hidden" name="reviewId" value={initialReview.id} /> : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground/75">Rating</span>
          <StarRatingInput
            name="rating"
            label="Review rating"
            value={rating}
            onChange={setRating}
          />
          <FieldError message={state.fieldErrors?.rating} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground/75">Comment</span>
          <textarea
            name="comment"
            defaultValue={initialReview?.comment ?? ""}
            rows={5}
            className="w-full rounded-2xl border border-foreground/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
            placeholder="Share what stood out, what worked, and what other people should know."
          />
          <FieldError message={state.fieldErrors?.comment} />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <ReviewSubmitButton hasExistingReview={hasExistingReview} />
          {state.status === "success" && state.message ? <p className="text-sm text-emerald-700">{state.message}</p> : null}
        </div>

        {state.status === "error" && state.message && !state.fieldErrors?.comment && !state.fieldErrors?.rating ? (
          <Notice tone="error">{state.message}</Notice>
        ) : null}
      </form>

      {initialReview ? (
        <p className="text-xs text-foreground/50">
          Your review is public. Deleting it will also update the place rating summary immediately.
        </p>
      ) : null}
    </div>
  );
}
