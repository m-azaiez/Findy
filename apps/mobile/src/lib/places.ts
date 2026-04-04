import { featuredCategories, featuredPlaces, featuredReviews } from "@findy/shared/constants/mock-data";
import { type Category, type Place, type Review } from "@findy/shared/domain";

export function getFeaturedPlaceBySlug(slug?: string) {
  if (!slug) {
    return null;
  }

  return featuredPlaces.find((place) => place.slug === slug) ?? null;
}

export function getFeaturedPlaces(limit = featuredPlaces.length) {
  return featuredPlaces.slice(0, limit);
}

export function getCategoryFilters() {
  return featuredCategories;
}

export function getPlacePrimaryCategory(place: Place) {
  return place.categories[0] ?? null;
}

export function getPlaceLocationLabel(place: Place) {
  return `${place.city}, ${place.address}`;
}

export function formatPriceTier(priceTier: Place["priceTier"]) {
  return priceTier.replace(/-/g, " ");
}

export function listPlaceReviews(placeId: string): Review[] {
  return featuredReviews.filter((review) => review.placeId === placeId);
}

export function filterPlaces(filters: {
  categorySlug?: string;
  openNow?: boolean;
  query?: string;
}) {
  const normalizedQuery = filters.query?.trim().toLowerCase() ?? "";

  return featuredPlaces.filter((place) => {
    const matchesCategory =
      !filters.categorySlug || place.categories.some((category) => category.slug === filters.categorySlug);
    const matchesOpenNow = !filters.openNow || place.isOpenNow;
    const matchesQuery =
      !normalizedQuery ||
      [place.name, place.city, place.shortDescription, place.description, ...place.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesOpenNow && matchesQuery;
  });
}

export function getDiscoveryCollections(): Array<{
  category: Category;
  description: string;
  id: string;
  place: Place;
  title: string;
}> {
  return [
    {
      id: "morning-cafe",
      title: "Slow morning start",
      description: "Warm light, steady coffee, and a place that supports a longer first stop.",
      category: featuredCategories[0],
      place: featuredPlaces[0]
    },
    {
      id: "sunset-view",
      title: "End-of-day view",
      description: "A lightweight plan when you want a destination that still feels calm on arrival.",
      category: featuredCategories[1],
      place: featuredPlaces[1]
    },
    {
      id: "culture-stop",
      title: "Short culture stop",
      description: "A compact browse with enough personality to justify the detour.",
      category: featuredCategories[3],
      place: featuredPlaces[2]
    }
  ];
}
