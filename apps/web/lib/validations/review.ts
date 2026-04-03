import { z } from "zod";

export const reviewSchema = z.object({
  placeId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(20).max(1000)
});

export type ReviewInput = z.infer<typeof reviewSchema>;
