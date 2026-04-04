import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hydratePlaceRows } from "@/services/places.service";
import { featuredPlaces } from "@findy/shared/constants/mock-data";
import { type Database } from "@findy/shared/database";
import { type Place } from "@findy/shared/domain";

type FavoritesClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"];
type FavoriteInsert = Database["public"]["Tables"]["favorites"]["Insert"];

export class FavoriteConfigError extends Error {
  constructor(message = "Favorites are unavailable until Supabase auth is configured.") {
    super(message);
    this.name = "FavoriteConfigError";
  }
}

export class FavoriteAuthError extends Error {
  constructor(message = "Sign in to save places.") {
    super(message);
    this.name = "FavoriteAuthError";
  }
}

export async function listFavoritePlaces(userId?: string | null): Promise<Place[]> {
  if (!hasSupabaseCredentials) {
    return featuredPlaces.slice(0, 2).map((place) => ({
      ...place,
      isFavorited: true
    }));
  }

  const client = await createServerSupabaseClient();
  const resolvedUserId = await resolveFavoriteUserId(client, userId);

  if (!resolvedUserId) {
    return [];
  }

  const { data: rawFavoriteRows, error } = await client
    .from("favorites")
    .select("*")
    .eq("user_id", resolvedUserId)
    .order("created_at", { ascending: false });
  const favoriteRows = (rawFavoriteRows ?? []) as FavoriteRow[];

  if (error) {
    throw error;
  }

  if (!favoriteRows.length) {
    return [];
  }

  const placeIds = favoriteRows.map((favorite) => favorite.place_id);
  const { data: placeRows, error: placeError } = await client.from("places").select("*").in("id", placeIds);

  if (placeError) {
    throw placeError;
  }

  const places = await hydratePlaceRows(client, placeRows ?? []);
  const placeById = new Map(
    places.map((place) => [
      place.id,
      {
        ...place,
        isFavorited: true
      }
    ])
  );

  return placeIds.flatMap((placeId) => {
    const place = placeById.get(placeId);
    return place ? [place] : [];
  });
}

export async function listFavoritePlaceIds(placeIds: string[], userId?: string | null): Promise<string[]> {
  if (!hasSupabaseCredentials || placeIds.length === 0) {
    return [];
  }

  const client = await createServerSupabaseClient();
  const resolvedUserId = await resolveFavoriteUserId(client, userId);

  if (!resolvedUserId) {
    return [];
  }

  const { data: rawFavoriteRows, error } = await client
    .from("favorites")
    .select("place_id")
    .eq("user_id", resolvedUserId)
    .in("place_id", placeIds);
  const favoriteRows = (rawFavoriteRows ?? []) as Pick<FavoriteRow, "place_id">[];

  if (error) {
    throw error;
  }

  return favoriteRows.map((favorite) => favorite.place_id);
}

export async function attachFavoriteState(places: Place[], userId?: string | null): Promise<Place[]> {
  if (places.length === 0) {
    return [];
  }

  if (!hasSupabaseCredentials) {
    return places;
  }

  const favoriteIds = new Set(await listFavoritePlaceIds(places.map((place) => place.id), userId));

  return places.map((place) => ({
    ...place,
    isFavorited: favoriteIds.has(place.id)
  }));
}

export async function toggleFavoritePlace(placeId: string, userId?: string | null): Promise<{ isFavorited: boolean }> {
  if (!hasSupabaseCredentials) {
    throw new FavoriteConfigError();
  }

  const client = await createServerSupabaseClient();
  const resolvedUserId = await resolveFavoriteUserId(client, userId);

  if (!resolvedUserId) {
    throw new FavoriteAuthError();
  }

  const { data: rawExistingFavorite, error: existingError } = await client
    .from("favorites")
    .select("place_id")
    .eq("user_id", resolvedUserId)
    .eq("place_id", placeId)
    .maybeSingle();
  const existingFavorite = rawExistingFavorite as Pick<FavoriteRow, "place_id"> | null;

  if (existingError) {
    throw existingError;
  }

  if (existingFavorite) {
    const { error: deleteError } = await client
      .from("favorites")
      .delete()
      .eq("user_id", resolvedUserId)
      .eq("place_id", placeId);

    if (deleteError) {
      throw deleteError;
    }

    return {
      isFavorited: false
    };
  }

  const favoriteInsert: FavoriteInsert = {
    user_id: resolvedUserId,
    place_id: placeId
  };
  const { error: insertError } = await client.from("favorites").insert(favoriteInsert as never);

  if (insertError) {
    throw insertError;
  }

  return {
    isFavorited: true
  };
}

async function resolveFavoriteUserId(client: FavoritesClient, userId?: string | null) {
  if (userId) {
    return userId;
  }

  const {
    data: { user }
  } = await client.auth.getUser();

  return user?.id ?? null;
}
