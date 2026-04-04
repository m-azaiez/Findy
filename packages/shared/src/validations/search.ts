import { z } from "zod";

export const searchFiltersSchema = z.object({
  query: z.string().default(""),
  city: z.string().default(""),
  category: z.string().default(""),
  minRating: z.string().default(""),
  openNow: z.boolean().default(false)
});

export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;
