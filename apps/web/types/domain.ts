export type PriceTier = "budget" | "mid-range" | "premium" | "luxury";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Place = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  city: string;
  country: string;
  address: string;
  averageRating: number;
  reviewCount: number;
  priceTier: PriceTier;
  isOpenNow: boolean;
  coverImageUrl: string;
  gallery: string[];
  tags: string[];
  categories: Category[];
  openingHours: Record<string, string>;
  isFavorited: boolean;
};

export type Review = {
  id: string;
  placeId: string;
  placeName: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type SearchFiltersState = {
  query: string;
  city: string;
  category: string;
  minRating: string;
  openNow: boolean;
};
