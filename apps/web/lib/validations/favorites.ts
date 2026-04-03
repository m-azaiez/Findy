import { z } from "zod";

export const toggleFavoriteSchema = z.object({
  placeId: z.string().uuid("Select a valid place."),
  returnTo: z.string().min(1).default("/")
});
