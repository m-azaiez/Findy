import { z } from "zod";

export const reviewSchema = z.object({
  placeId: z.string().min(1, "This place could not be identified."),
  rating: z.coerce
    .number()
    .min(0.5, "Choose a rating between 0.5 and 5.")
    .max(5, "Choose a rating between 0.5 and 5.")
    .refine((value) => Number.isInteger(value * 2), "Use half-star increments only."),
  comment: z
    .string()
    .trim()
    .min(8, "Write at least 8 characters for your review.")
    .max(600, "Use 600 characters or fewer for your review.")
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const createReviewSchema = reviewSchema.extend({
  returnTo: z.string().optional()
});

export const updateReviewSchema = reviewSchema.extend({
  reviewId: z.string().min(1, "This review could not be identified."),
  returnTo: z.string().optional()
});

export const deleteReviewSchema = z.object({
  reviewId: z.string().min(1, "This review could not be identified."),
  returnTo: z.string().optional()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type DeleteReviewInput = z.infer<typeof deleteReviewSchema>;
