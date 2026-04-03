import { z } from "zod";

export const reviewSchema = z.object({
  placeId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(20).max(1000)
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const createReviewSchema = reviewSchema.extend({
  returnTo: z.string().optional()
});

export const updateReviewSchema = reviewSchema.extend({
  reviewId: z.string().min(1),
  returnTo: z.string().optional()
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().min(1),
  returnTo: z.string().optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type DeleteReviewInput = z.infer<typeof deleteReviewSchema>;
