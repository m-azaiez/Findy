import { hasSupabaseCredentials } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { featuredPlaces } from "@findy/shared/constants/mock-data";
import { type Database } from "@findy/shared/database";
import { mapPlaceCategories, mapPlaceRow } from "@findy/shared/mappers/database";
import { type Place } from "@findy/shared/domain";
import { type CreatePlaceInput } from "@findy/shared/validations/place";
import { type SearchFiltersInput } from "@findy/shared/validations/search";

type PlacesClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type PlaceInsert = Database["public"]["Tables"]["places"]["Insert"];
type PlaceRow = Database["public"]["Tables"]["places"]["Row"];
type PlaceCategoryInsert = Database["public"]["Tables"]["place_categories"]["Insert"];

export class PlaceConfigError extends Error {
  constructor(message = "Place management is unavailable until Supabase is configured.") {
    super(message);
    this.name = "PlaceConfigError";
  }
}

export class PlaceConflictError extends Error {
  constructor(message = "A place with this slug already exists.") {
    super(message);
    this.name = "PlaceConflictError";
  }
}

export class PlaceCategoryError extends Error {
  constructor(message = "Select at least one existing category.") {
    super(message);
    this.name = "PlaceCategoryError";
  }
}

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

export async function createPlace(payload: CreatePlaceInput, createdBy?: string | null): Promise<Place> {
  if (!hasSupabaseCredentials) {
    throw new PlaceConfigError();
  }

  const client = await createServerSupabaseClient();
  const normalizedSlug = payload.slug.trim().toLowerCase();
  const normalizedCategoryIds = [...new Set(payload.categoryIds)];
  const categoryRows = await fetchCategories(client, normalizedCategoryIds);

  if (categoryRows.length !== normalizedCategoryIds.length) {
    throw new PlaceCategoryError();
  }

  const { data: existingPlace, error: existingPlaceError } = await client
    .from("places")
    .select("id")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (existingPlaceError) {
    throw existingPlaceError;
  }

  if (existingPlace) {
    throw new PlaceConflictError();
  }

  const placeInsert: PlaceInsert = {
    address: payload.address,
    city: payload.city,
    country: payload.country,
    cover_image_url: payload.coverImageUrl || null,
    created_by: createdBy ?? null,
    description: payload.description,
    gallery: [],
    is_open_now: payload.isOpenNow,
    name: payload.name,
    opening_hours: {},
    price_tier: payload.priceTier,
    short_description: payload.shortDescription,
    slug: normalizedSlug,
    tags: payload.tags
  };

  const { data: rawCreatedPlace, error: createPlaceError } = await client
    .from("places")
    .insert(placeInsert as never)
    .select("*")
    .maybeSingle();
  const createdPlace = rawCreatedPlace as PlaceRow | null;

  if (createPlaceError) {
    if (createPlaceError.code === "23505") {
      throw new PlaceConflictError();
    }

    throw createPlaceError;
  }

  if (!createdPlace) {
    throw new Error("The place was created, but it could not be loaded.");
  }

  try {
    const placeCategoryInserts: PlaceCategoryInsert[] = normalizedCategoryIds.map((categoryId) => ({
      category_id: categoryId,
      place_id: createdPlace.id
    }));

    const { error: placeCategoryError } = await client.from("place_categories").insert(placeCategoryInserts as never);

    if (placeCategoryError) {
      throw placeCategoryError;
    }
  } catch (error) {
    await client.from("places").delete().eq("id", createdPlace.id);
    throw error;
  }

  const [place] = await hydratePlaceRows(client, [createdPlace]);

  if (!place) {
    throw new Error("The created place could not be hydrated.");
  }

  return place;
}

export async function hydratePlaceRows(
  client: PlacesClient,
  placeRows: PlaceRow[]
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
  client: PlacesClient,
  categoryIds: string[]
) {
  const { data, error } = await client.from("categories").select("*").in("id", categoryIds);

  if (error) {
    throw error;
  }

  return (data ?? []) as CategoryRow[];
}
