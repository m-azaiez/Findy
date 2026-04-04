import { featuredPlaces } from "@findy/shared/constants/mock-data";

export function getFeaturedPlaceBySlug(slug?: string) {
  if (!slug) {
    return null;
  }

  return featuredPlaces.find((place) => place.slug === slug) ?? null;
}
