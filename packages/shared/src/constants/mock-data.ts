import { type Category, type Place, type Review } from "../domain";

export const featuredCategories: Category[] = [
  {
    id: "cat-cafe",
    name: "Cafe",
    slug: "cafe",
    description: "Coffee spots worth lingering in."
  },
  {
    id: "cat-viewpoint",
    name: "Viewpoint",
    slug: "viewpoint",
    description: "Places with a clear sense of arrival."
  },
  {
    id: "cat-hotel",
    name: "Boutique Hotel",
    slug: "boutique-hotel",
    description: "Stay experiences with a stronger point of view."
  },
  {
    id: "cat-gallery",
    name: "Gallery",
    slug: "gallery",
    description: "Creative spaces and contemporary culture."
  }
];

export const featuredPlaces: Place[] = [
  {
    id: "place-canal-house",
    slug: "canal-house",
    name: "Canal House",
    shortDescription: "An all-day cafe built around warm light, long tables, and slow mornings.",
    description:
      "Canal House is designed like a neighborhood anchor: bright during the day, intimate after dusk, and relaxed enough to work, meet, or pause between errands.",
    city: "Montreal",
    country: "Canada",
    address: "127 Saint-Ambroise Street",
    averageRating: 4.7,
    reviewCount: 128,
    priceTier: "mid-range",
    isOpenNow: true,
    coverImageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["coffee", "design-led", "all-day"],
    categories: [featuredCategories[0]],
    openingHours: {
      monday: "07:30 - 18:00",
      tuesday: "07:30 - 18:00",
      wednesday: "07:30 - 18:00",
      thursday: "07:30 - 21:00",
      friday: "07:30 - 21:00",
      saturday: "08:00 - 21:00",
      sunday: "08:00 - 18:00"
    },
    isFavorited: false
  },
  {
    id: "place-belvedere-nord",
    slug: "belvedere-nord",
    name: "Belvedere Nord",
    shortDescription: "A panoramic terrace above the tree line with a quiet, cinematic skyline view.",
    description:
      "Belvedere Nord turns a standard lookout into a destination. The space is minimal, the sightlines are broad, and the atmosphere is deliberately calm.",
    city: "Quebec City",
    country: "Canada",
    address: "18 Panorama Avenue",
    averageRating: 4.8,
    reviewCount: 86,
    priceTier: "budget",
    isOpenNow: true,
    coverImageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["sunset", "scenic", "outdoor"],
    categories: [featuredCategories[1]],
    openingHours: {
      monday: "06:00 - 22:00",
      tuesday: "06:00 - 22:00",
      wednesday: "06:00 - 22:00",
      thursday: "06:00 - 22:00",
      friday: "06:00 - 23:00",
      saturday: "06:00 - 23:00",
      sunday: "06:00 - 22:00"
    },
    isFavorited: false
  },
  {
    id: "place-atelier-rue-nord",
    slug: "atelier-rue-nord",
    name: "Atelier Rue Nord",
    shortDescription: "A small gallery with rotating installations, books, and a strong local point of view.",
    description:
      "Atelier Rue Nord mixes exhibition programming, a compact reading room, and a thoughtful shop. It is built for browsing, returning, and discovering new work without friction.",
    city: "Toronto",
    country: "Canada",
    address: "42 Mercer Street",
    averageRating: 4.5,
    reviewCount: 41,
    priceTier: "mid-range",
    isOpenNow: false,
    coverImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["art", "independent", "curated"],
    categories: [featuredCategories[3]],
    openingHours: {
      monday: "Closed",
      tuesday: "11:00 - 18:00",
      wednesday: "11:00 - 18:00",
      thursday: "11:00 - 19:00",
      friday: "11:00 - 19:00",
      saturday: "10:00 - 18:00",
      sunday: "10:00 - 16:00"
    },
    isFavorited: false
  }
];

export const featuredReviews: Review[] = [
  {
    id: "review-1",
    placeId: "place-canal-house",
    placeName: "Canal House",
    authorName: "Nora Tremblay",
    rating: 5,
    comment: "The space feels calm without being sterile, and the service pace matches the atmosphere.",
    createdAt: "2026-03-24T10:00:00.000Z",
    updatedAt: "2026-03-24T10:00:00.000Z"
  },
  {
    id: "review-2",
    placeId: "place-belvedere-nord",
    placeName: "Belvedere Nord",
    authorName: "Alex Chen",
    rating: 5,
    comment: "Best at the end of the day. The view opens up gradually and the whole place feels intentional.",
    createdAt: "2026-03-22T16:30:00.000Z",
    updatedAt: "2026-03-22T16:30:00.000Z"
  },
  {
    id: "review-3",
    placeId: "place-atelier-rue-nord",
    placeName: "Atelier Rue Nord",
    authorName: "Mina Roy",
    rating: 4,
    comment: "Small footprint, strong curation, and a nice mix of print objects and contemporary work.",
    createdAt: "2026-03-20T12:15:00.000Z",
    updatedAt: "2026-03-20T12:15:00.000Z"
  }
];
