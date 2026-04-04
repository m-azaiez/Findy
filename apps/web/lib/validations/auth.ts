import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters for the password.")
  .max(72, "Use 72 characters or fewer for the password.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const signUpSchema = signInSchema
  .extend({
    fullName: z.string().trim().min(2, "Enter your full name.").max(120, "Use 120 characters or fewer."),
    confirmPassword: passwordSchema
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"]
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"]
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
