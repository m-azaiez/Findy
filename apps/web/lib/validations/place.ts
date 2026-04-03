import { z } from "zod";

export const placeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(20).max(180),
  description: z.string().min(40),
  city: z.string().min(2),
  country: z.string().min(2),
  address: z.string().min(5),
  priceTier: z.enum(["budget", "mid-range", "premium", "luxury"]),
  tags: z.array(z.string()).default([])
});

export type PlaceInput = z.infer<typeof placeSchema>;
