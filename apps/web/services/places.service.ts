import { featuredPlaces } from "@/lib/constants/mock-data";
import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapPlaceCategories, mapPlaceRow } from "@/lib/mappers/database";
import { type SearchFiltersInput } from "@/lib/validations/search";
import { type Database } from "@/types/database";
import { type Place } from "@/types/domain";

export async function getFeaturedPlaces(): Promise<Place[]> {
  if (!hasSupabaseCredentials) {
    return featuredPlaces;
  }

  const client = await createServerSupabaseClient();
  const { data: placeRows, error } = await client
    .from("places")
    .select("*")
    .order("review_count", { ascending: false })
    .order("average_rating", { ascending: false })
    .limit(3);

  if (error) {
    throw error;
  }

  return hydratePlaceRows(client, placeRows ?? []);
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  if (!hasSupabaseCredentials) {
    return featuredPlaces.find((place) => place.slug === slug) ?? null;
  }

  const client = await createServerSupabaseClient();
  const { data: placeRow, error } = await client.from("places").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    throw error;
  }

  if (!placeRow) {
    return null;
  }

  const [place] = await hydratePlaceRows(client, [placeRow]);
  return place ?? null;
}

export async function searchPlaces(filters: SearchFiltersInput): Promise<Place[]> {
  if (!hasSupabaseCredentials) {
    return featuredPlaces.filter((place) => {
      const matchesQuery =
        !filters.query ||
        [place.name, place.shortDescription, ...place.tags]
          .join(" ")
          .toLowerCase()
          .includes(filters.query.toLowerCase());

      const matchesCity = !filters.city || place.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchesCategory =
        !filters.category || place.categories.some((category) => category.slug === filters.category);
      const matchesRating =
        !filters.minRating || place.averageRating >= Number.parseFloat(filters.minRating);
      const matchesOpenState = !filters.openNow || place.isOpenNow;

      return matchesQuery && matchesCity && matchesCategory && matchesRating && matchesOpenState;
    });
  }

  const client = await createServerSupabaseClient();
  let query = client.from("places").select("*");

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters.minRating) {
    query = query.gte("average_rating", Number.parseFloat(filters.minRating));
  }

  if (filters.openNow) {
    query = query.eq("is_open_now", true);
  }

  if (filters.category) {
    const { data: rawCategoryRow, error: categoryError } = await client
      .from("categories")
      .select("*")
      .eq("slug", filters.category)
      .maybeSingle();
    const categoryRow = rawCategoryRow as Database["public"]["Tables"]["categories"]["Row"] | null;

    if (categoryError) {
      throw categoryError;
    }

    if (!categoryRow) {
      return [];
    }

    const { data: rawPlaceCategoryRows, error: placeCategoryError } = await client
      .from("place_categories")
      .select("*")
      .eq("category_id", categoryRow.id);
    const placeCategoryRows = (rawPlaceCategoryRows ?? []) as Database["public"]["Tables"]["place_categories"]["Row"][];

    if (placeCategoryError) {
      throw placeCategoryError;
    }

    const placeIds = [...new Set((placeCategoryRows ?? []).map((row) => row.place_id))];

    if (!placeIds.length) {
      return [];
    }

    query = query.in("id", placeIds);
  }

  if (filters.query) {
    const searchTerm = escapeSearchValue(filters.query);
    query = query.or(
      `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  const { data: placeRows, error } = await query
    .order("average_rating", { ascending: false })
    .order("review_count", { ascending: false });

  if (error) {
    throw error;
  }

  const places = await hydratePlaceRows(client, placeRows ?? []);

  if (!filters.query) {
    return places;
  }

  const loweredQuery = filters.query.toLowerCase();

  return places.filter((place) =>
    [place.name, place.shortDescription, place.description, ...place.tags]
      .join(" ")
      .toLowerCase()
      .includes(loweredQuery)
  );
}

export async function hydratePlaceRows(
  client: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  placeRows: Database["public"]["Tables"]["places"]["Row"][]
) {
  if (!placeRows.length) {
    return [];
  }

  const placeIds = placeRows.map((place) => place.id);
  const { data: rawPlaceCategoryRows, error: placeCategoryError } = await client
    .from("place_categories")
    .select("*")
    .in("place_id", placeIds);
  const placeCategoryRows = (rawPlaceCategoryRows ?? []) as Database["public"]["Tables"]["place_categories"]["Row"][];

  if (placeCategoryError) {
    throw placeCategoryError;
  }

  const categoryIds = [...new Set(placeCategoryRows.map((row) => row.category_id))];
  const categoryRows =
    categoryIds.length > 0
      ? await fetchCategories(client, categoryIds)
      : [];

  const categoriesByPlaceId = mapPlaceCategories(placeCategoryRows, categoryRows);

  return placeRows.map((place) => mapPlaceRow(place, categoriesByPlaceId.get(place.id) ?? []));
}

function escapeSearchValue(value: string) {
  return value.replaceAll(",", " ").replaceAll("(", " ").replaceAll(")", " ").trim();
}

async function fetchCategories(
  client: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  categoryIds: string[]
) {
  const { data, error } = await client.from("categories").select("*").in("id", categoryIds);

  if (error) {
    throw error;
  }

  return data ?? [];
}
