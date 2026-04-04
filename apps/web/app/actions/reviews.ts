"use server";

import { revalidatePath } from "next/cache";

import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createReviewSchema, deleteReviewSchema, updateReviewSchema } from "@/lib/validations/review";
import { sanitizeRedirectPath } from "@/lib/utils/url";
import {
  ReviewAuthError,
  ReviewConfigError,
  ReviewConflictError,
  ReviewNotFoundError,
  ReviewPermissionError,
  createReview,
  deleteReview,
  updateOwnReview
} from "@/services/reviews.service";

export type ReviewActionState = {
  averageRating?: number;
  fieldErrors?: {
    comment?: string;
    placeId?: string;
    rating?: string;
    reviewId?: string;
  };
  message?: string;
  reviewCount?: number;
  reviewId?: string;
  status: "idle" | "success" | "error";
};

const initialErrorMessage = "This review could not be updated right now.";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function revalidateReviewPaths(returnTo: string) {
  revalidatePath(returnTo);
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reviews");
}

function toErrorState(message: string): ReviewActionState {
  return {
    message,
    status: "error"
  };
}

function getReviewFieldErrors(fieldErrors: Record<string, string[] | undefined>): ReviewActionState["fieldErrors"] {
  return Object.fromEntries(
    Object.entries(fieldErrors)
      .filter(([, value]) => Boolean(value?.[0]))
      .map(([key, value]) => [key, value?.[0]])
  );
}

function mapReviewError(error: unknown) {
  if (
    error instanceof ReviewConfigError ||
    error instanceof ReviewAuthError ||
    error instanceof ReviewConflictError ||
    error instanceof ReviewNotFoundError ||
    error instanceof ReviewPermissionError
  ) {
    return error.message;
  }

  return error instanceof Error ? error.message : initialErrorMessage;
}

export async function createReviewAction(
  _previousState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  if (!hasSupabaseCredentials) {
    return toErrorState("Reviews are unavailable until Supabase auth is configured.");
  }

  const parsed = createReviewSchema.safeParse({
    comment: getFormValue(formData, "comment"),
    placeId: getFormValue(formData, "placeId"),
    rating: getFormValue(formData, "rating"),
    returnTo: getFormValue(formData, "returnTo")
  });

  if (!parsed.success) {
    return {
      fieldErrors: getReviewFieldErrors(parsed.error.flatten().fieldErrors),
      message: parsed.error.issues[0]?.message ?? initialErrorMessage,
      status: "error"
    };
  }

  try {
    const result = await createReview({
      comment: parsed.data.comment,
      placeId: parsed.data.placeId,
      rating: parsed.data.rating
    });
    const returnTo = sanitizeRedirectPath(parsed.data.returnTo, "/");

    revalidateReviewPaths(returnTo);

    return {
      averageRating: result.averageRating,
      message: "Review published.",
      reviewCount: result.reviewCount,
      reviewId: result.review?.id,
      status: "success"
    };
  } catch (error) {
    return toErrorState(mapReviewError(error));
  }
}

export async function updateReviewAction(
  _previousState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  if (!hasSupabaseCredentials) {
    return toErrorState("Reviews are unavailable until Supabase auth is configured.");
  }

  const parsed = updateReviewSchema.safeParse({
    comment: getFormValue(formData, "comment"),
    placeId: getFormValue(formData, "placeId"),
    rating: getFormValue(formData, "rating"),
    returnTo: getFormValue(formData, "returnTo"),
    reviewId: getFormValue(formData, "reviewId")
  });

  if (!parsed.success) {
    return {
      fieldErrors: getReviewFieldErrors(parsed.error.flatten().fieldErrors),
      message: parsed.error.issues[0]?.message ?? initialErrorMessage,
      status: "error"
    };
  }

  try {
    const result = await updateOwnReview(parsed.data.reviewId, {
      comment: parsed.data.comment,
      rating: parsed.data.rating
    });
    const returnTo = sanitizeRedirectPath(parsed.data.returnTo, "/");

    revalidateReviewPaths(returnTo);

    return {
      averageRating: result.averageRating,
      message: "Review updated.",
      reviewCount: result.reviewCount,
      reviewId: result.review?.id,
      status: "success"
    };
  } catch (error) {
    return toErrorState(mapReviewError(error));
  }
}

export async function deleteReviewAction(
  _previousState: ReviewActionState,
  formData: FormData
): Promise<ReviewActionState> {
  if (!hasSupabaseCredentials) {
    return toErrorState("Reviews are unavailable until Supabase auth is configured.");
  }

  const parsed = deleteReviewSchema.safeParse({
    returnTo: getFormValue(formData, "returnTo"),
    reviewId: getFormValue(formData, "reviewId")
  });

  if (!parsed.success) {
    return {
      fieldErrors: getReviewFieldErrors(parsed.error.flatten().fieldErrors),
      message: parsed.error.issues[0]?.message ?? initialErrorMessage,
      status: "error"
    };
  }

  try {
    const result = await deleteReview(parsed.data.reviewId);
    const returnTo = sanitizeRedirectPath(parsed.data.returnTo, "/");

    revalidateReviewPaths(returnTo);

    return {
      averageRating: result.averageRating,
      message: "Review removed.",
      reviewCount: result.reviewCount,
      status: "success"
    };
  } catch (error) {
    return toErrorState(mapReviewError(error));
  }
}
