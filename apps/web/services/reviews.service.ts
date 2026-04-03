import { featuredReviews } from "@/lib/constants/mock-data";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapReviewRow } from "@/lib/mappers/database";
import { type Database } from "@/types/database";
import { type Review } from "@/types/domain";

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

export async function listRecentReviews(): Promise<Review[]> {
  if (!hasSupabaseCredentials) {
    return featuredReviews;
  }

  const client = await createServerSupabaseClient();
  const { data: reviewRows, error } = await client
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    throw error;
  }

  return hydrateReviews(client, reviewRows ?? []);
}

async function hydrateReviews(
  client: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  reviewRows: Database["public"]["Tables"]["reviews"]["Row"][]
) {
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
