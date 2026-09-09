import { z } from "zod";
import auth from "@/messages/en/auth.json";

// Usar los mismos esquemas que el backend

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, auth.signUpSchema.firstNameMin)
      .max(100, auth.signUpSchema.firstNameMax),

    lastName: z
      .string()
      .trim()
      .min(2, auth.signUpSchema.lastNameMin)
      .max(100, auth.signUpSchema.lastNameMax),

    email: z.string().trim().toLowerCase().email(auth.signUpSchema.emailInvalid),

    password: z
      .string()
      .min(8, auth.signUpSchema.passwordMin)
      .max(128, auth.signUpSchema.passwordMax)
      .regex(/[a-z]/, auth.signUpSchema.passwordLowercase)
      .regex(/[A-Z]/, auth.signUpSchema.passwordUppercase)
      .regex(/\d/, auth.signUpSchema.passwordNumber),

    confirmPassword: z.string(),

    timezone: z.string(),

    locale: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: auth.signUpSchema.passwordsMismatch,
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email(auth.signInSchema.emailInvalid),

  password: z.string().min(1, auth.signInSchema.passwordRequired),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
