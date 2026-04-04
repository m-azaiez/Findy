import { type Database, type Json } from "../database";
import { type Category, type Place, type Review } from "../domain";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type PlaceRow = Database["public"]["Tables"]["places"]["Row"];
type PlaceCategoryRow = Database["public"]["Tables"]["place_categories"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

const fallbackCoverImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

export function mapCategoryRow(category: CategoryRow): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined
  };
}

export function mapPlaceRow(place: PlaceRow, categories: Category[] = []): Place {
  const gallery = Array.isArray(place.gallery) ? place.gallery : [];

  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    shortDescription: place.short_description,
    description: place.description,
    city: place.city,
    country: place.country,
    address: place.address,
    averageRating: Number(place.average_rating ?? 0),
    reviewCount: place.review_count ?? 0,
    priceTier: place.price_tier,
    isOpenNow: place.is_open_now,
    coverImageUrl: place.cover_image_url ?? gallery[0] ?? fallbackCoverImage,
    gallery,
    tags: place.tags,
    categories,
    openingHours: mapOpeningHours(place.opening_hours),
    isFavorited: false
  };
}

export function mapPlaceCategories(
  placeCategoryRows: PlaceCategoryRow[],
  categoryRows: CategoryRow[]
): Map<string, Category[]> {
  const categoriesById = new Map(categoryRows.map((category) => [category.id, mapCategoryRow(category)]));
  const categoriesByPlaceId = new Map<string, Category[]>();

  placeCategoryRows.forEach((row) => {
    const category = categoriesById.get(row.category_id);

    if (!category) {
      return;
    }

    const current = categoriesByPlaceId.get(row.place_id) ?? [];
    categoriesByPlaceId.set(row.place_id, [...current, category]);
  });

  return categoriesByPlaceId;
}

export function mapReviewRow(
  review: ReviewRow,
  options: {
    placeName?: string;
    profile?: Pick<ProfileRow, "full_name" | "username"> | null;
  } = {}
): Review {
  return {
    id: review.id,
    placeId: review.place_id,
    placeName: options.placeName ?? "Unknown place",
    authorName: options.profile?.full_name ?? options.profile?.username ?? "Community member",
    rating: Number(review.rating),
    comment: review.comment,
    createdAt: review.created_at,
    updatedAt: review.updated_at
  };
}

function mapOpeningHours(value: Json): Record<string, string> {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string>>((accumulator, [day, hours]) => {
    if (typeof hours === "string") {
      accumulator[day] = hours;
    }

    return accumulator;
  }, {});
}
