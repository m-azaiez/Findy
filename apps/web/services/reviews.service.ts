import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { featuredReviews } from "@findy/shared/constants/mock-data";
import { type Database } from "@findy/shared/database";
import { mapReviewRow } from "@findy/shared/mappers/database";
import { type Review } from "@findy/shared/domain";
import { type ReviewInput } from "@findy/shared/validations/review";

type ReviewsClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];
type ProfileRoleRow = Pick<Database["public"]["Tables"]["profiles"]["Row"], "role">;

type ReviewActor = {
  isAdmin: boolean;
  userId: string;
};

type PlaceReviewSummaryRow = Pick<Database["public"]["Tables"]["places"]["Row"], "average_rating" | "id" | "review_count">;

export type ReviewMutationResult = {
  averageRating: number;
  placeId: string;
  review: Review | null;
  reviewCount: number;
};

export class ReviewConfigError extends Error {
  constructor(message = "Reviews are unavailable until Supabase auth is configured.") {
    super(message);
    this.name = "ReviewConfigError";
  }
}

export class ReviewAuthError extends Error {
  constructor(message = "Sign in to write a review.") {
    super(message);
    this.name = "ReviewAuthError";
  }
}

export class ReviewConflictError extends Error {
  constructor(message = "You have already reviewed this place.") {
    super(message);
    this.name = "ReviewConflictError";
  }
}

export class ReviewNotFoundError extends Error {
  constructor(message = "This review could not be found.") {
    super(message);
    this.name = "ReviewNotFoundError";
  }
}

export class ReviewPermissionError extends Error {
  constructor(message = "You do not have permission to change this review.") {
    super(message);
    this.name = "ReviewPermissionError";
  }
}

export async function listReviewsForPlace(placeId: string): Promise<Review[]> {
  if (!hasSupabaseCredentials) {
    return featuredReviews.filter((review) => review.placeId === placeId);
  }

  const client = await createServerSupabaseClient();
  const { data: reviewRows, error } = await client
    .from("reviews")
    .select("*")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return hydrateReviews(client, reviewRows ?? []);
}

export async function listRecentReviews(userId?: string): Promise<Review[]> {
  if (!hasSupabaseCredentials) {
    return featuredReviews;
  }

  const client = await createServerSupabaseClient();
  let query = client
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data: reviewRows, error } = await query;

  if (error) {
    throw error;
  }

  return hydrateReviews(client, reviewRows ?? []);
}

export async function getViewerReviewForPlace(placeId: string): Promise<Review | null> {
  if (!hasSupabaseCredentials) {
    return null;
  }

  const client = await createServerSupabaseClient();
  const actor = await resolveOptionalReviewActor(client);

  if (!actor) {
    return null;
  }

  const { data: reviewRow, error } = await client
    .from("reviews")
    .select("*")
    .eq("place_id", placeId)
    .eq("user_id", actor.userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!reviewRow) {
    return null;
  }

  const [review] = await hydrateReviews(client, [reviewRow]);
  return review ?? null;
}

export async function createReview(payload: ReviewInput): Promise<ReviewMutationResult> {
  const client = await requireReviewClient();
  const actor = await resolveReviewActor(client);

  const { data: existingReview, error: existingError } = await client
    .from("reviews")
    .select("id")
    .eq("place_id", payload.placeId)
    .eq("user_id", actor.userId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingReview) {
    throw new ReviewConflictError();
  }

  const reviewInsert: ReviewInsert = {
    comment: payload.comment,
    place_id: payload.placeId,
    rating: payload.rating,
    user_id: actor.userId
  };

  const { data: rawCreatedReview, error: createError } = await client
    .from("reviews")
    .insert(reviewInsert as never)
    .select("*")
    .maybeSingle();
  const createdReview = rawCreatedReview as ReviewRow | null;

  if (createError) {
    if (createError.code === "23505") {
      throw new ReviewConflictError();
    }

    throw createError;
  }

  if (!createdReview) {
    throw new ReviewNotFoundError("The review was created, but it could not be loaded.");
  }

  return buildReviewMutationResult(client, createdReview);
}

export async function updateOwnReview(
  reviewId: string,
  payload: Pick<ReviewInput, "comment" | "rating">
): Promise<ReviewMutationResult> {
  const client = await requireReviewClient();
  const actor = await resolveReviewActor(client);
  const existingReview = await getReviewRecord(client, reviewId);

  if (existingReview.user_id !== actor.userId) {
    throw new ReviewPermissionError("Only the review author can edit this review.");
  }

  const reviewUpdate: ReviewUpdate = {
    comment: payload.comment,
    rating: payload.rating
  };

  const { data: rawUpdatedReview, error } = await client
    .from("reviews")
    .update(reviewUpdate as never)
    .eq("id", reviewId)
    .select("*")
    .maybeSingle();
  const updatedReview = rawUpdatedReview as ReviewRow | null;

  if (error) {
    throw error;
  }

  if (!updatedReview) {
    throw new ReviewNotFoundError("The updated review could not be loaded.");
  }

  return buildReviewMutationResult(client, updatedReview);
}

export async function deleteReview(reviewId: string): Promise<ReviewMutationResult> {
  const client = await requireReviewClient();
  const actor = await resolveReviewActor(client);
  const existingReview = await getReviewRecord(client, reviewId);

  if (existingReview.user_id !== actor.userId && !actor.isAdmin) {
    throw new ReviewPermissionError("Only the review author or an admin can remove this review.");
  }

  const { data: rawDeletedReview, error } = await client
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .select("*")
    .maybeSingle();
  const deletedReview = rawDeletedReview as ReviewRow | null;

  if (error) {
    throw error;
  }

  if (!deletedReview) {
    throw new ReviewNotFoundError("The deleted review could not be loaded.");
  }

  const placeSummary = await getPlaceReviewSummary(client, deletedReview.place_id);

  return {
    averageRating: Number(placeSummary?.average_rating ?? 0),
    placeId: deletedReview.place_id,
    review: null,
    reviewCount: placeSummary?.review_count ?? 0
  } satisfies ReviewMutationResult;
}

async function requireReviewClient() {
  if (!hasSupabaseCredentials) {
    throw new ReviewConfigError();
  }

  return createServerSupabaseClient();
}

async function resolveReviewActor(client: ReviewsClient): Promise<ReviewActor> {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    throw new ReviewAuthError();
  }

  const { data: rawProfile, error } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const profile = rawProfile as ProfileRoleRow | null;

  if (error) {
    throw error;
  }

  return {
    isAdmin: profile?.role === "admin",
    userId: user.id
  };
}

async function resolveOptionalReviewActor(client: ReviewsClient): Promise<ReviewActor | null> {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: rawProfile, error } = await client.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const profile = rawProfile as ProfileRoleRow | null;

  if (error) {
    throw error;
  }

  return {
    isAdmin: profile?.role === "admin",
    userId: user.id
  };
}

async function getReviewRecord(client: ReviewsClient, reviewId: string): Promise<ReviewRow> {
  const { data: rawReviewRow, error } = await client.from("reviews").select("*").eq("id", reviewId).maybeSingle();
  const reviewRow = rawReviewRow as ReviewRow | null;

  if (error) {
    throw error;
  }

  if (!reviewRow) {
    throw new ReviewNotFoundError();
  }

  return reviewRow;
}

async function buildReviewMutationResult(client: ReviewsClient, reviewRow: ReviewRow): Promise<ReviewMutationResult> {
  const [review] = await hydrateReviews(client, [reviewRow]);
  const placeSummary = await getPlaceReviewSummary(client, reviewRow.place_id);

  return {
    averageRating: Number(placeSummary?.average_rating ?? 0),
    placeId: reviewRow.place_id,
    review: review ?? null,
    reviewCount: placeSummary?.review_count ?? 0
  };
}

async function getPlaceReviewSummary(client: ReviewsClient, placeId: string): Promise<PlaceReviewSummaryRow | null> {
  const { data, error } = await client
    .from("places")
    .select("id, average_rating, review_count")
    .eq("id", placeId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function hydrateReviews(client: ReviewsClient, reviewRows: ReviewRow[]) {
  if (!reviewRows.length) {
    return [];
  }

  const placeIds = [...new Set(reviewRows.map((review) => review.place_id))];
  const userIds = [...new Set(reviewRows.map((review) => review.user_id))];

  type PlaceNameRow = Pick<Database["public"]["Tables"]["places"]["Row"], "id" | "name">;
  type ProfileSummaryRow = Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "full_name" | "username">;

  const [placesResponse, profilesResponse] = await Promise.all([
    placeIds.length > 0
      ? client.from("places").select("id, name").in("id", placeIds)
      : Promise.resolve({ data: [] as PlaceNameRow[], error: null }),
    userIds.length > 0
      ? client.from("profiles").select("id, full_name, username").in("id", userIds)
      : Promise.resolve({ data: [] as ProfileSummaryRow[], error: null })
  ]);

  if (placesResponse.error) {
    throw placesResponse.error;
  }

  if (profilesResponse.error) {
    throw profilesResponse.error;
  }

  const placeNameById = new Map((placesResponse.data ?? []).map((place) => [place.id, place.name]));
  const profileById = new Map((profilesResponse.data ?? []).map((profile) => [profile.id, profile]));

  return reviewRows.map((review) =>
    mapReviewRow(review, {
      placeName: placeNameById.get(review.place_id),
      profile: profileById.get(review.user_id)
    })
  );
}
