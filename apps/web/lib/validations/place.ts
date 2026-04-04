import { z } from "zod";

const placeSlugSchema = z
  .string()
  .trim()
  .min(2, "Use at least 2 characters for the slug.")
  .max(80, "Use 80 characters or fewer for the slug.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

const placeTagSchema = z
  .string()
  .trim()
  .min(1, "Tags cannot be empty.")
  .max(24, "Use 24 characters or fewer per tag.");

export const placeSchema = z.object({
  name: z.string().trim().min(2, "Enter the place name.").max(120, "Use 120 characters or fewer for the name."),
  slug: placeSlugSchema,
  shortDescription: z
    .string()
    .trim()
    .min(12, "Write a short description of at least 12 characters.")
    .max(180, "Use 180 characters or fewer for the short description."),
  description: z
    .string()
    .trim()
    .min(24, "Write a fuller description of at least 24 characters.")
    .max(4000, "Use 4000 characters or fewer for the description."),
  city: z.string().trim().min(2, "Enter the city.").max(120, "Use 120 characters or fewer for the city."),
  country: z.string().trim().min(2, "Enter the country.").max(120, "Use 120 characters or fewer for the country.").default("Canada"),
  address: z.string().trim().min(5, "Enter the address.").max(200, "Use 200 characters or fewer for the address."),
  priceTier: z.enum(["budget", "mid-range", "premium", "luxury"], {
    message: "Choose a price tier."
  }),
  tags: z.array(placeTagSchema).max(10, "Use 10 tags or fewer.").default([])
});

export type PlaceInput = z.infer<typeof placeSchema>;

const optionalUrlSchema = z.union([z.string().trim().url("Enter a valid image URL."), z.literal("")]).optional();

export const createPlaceSchema = placeSchema.extend({
  categoryIds: z
    .array(z.string().uuid("Choose a valid category."))
    .min(1, "Select at least one category."),
  coverImageUrl: optionalUrlSchema,
  isOpenNow: z.boolean().default(false),
  returnTo: z.string().optional()
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
