import { z } from "zod";
import { locales } from "@/lib/locale";
import type { Translator } from "./common.schema";

// Usar los mismos esquemas que el backend

// El identificador publico con el que se menciona a alguien (@usuario). Se guarda en minusculas
// para que la unicidad no dependa de como lo escriba cada uno.
const usernameSchema = (t: Translator) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .min(3, t("signUpSchema.usernameMin"))
    .max(30, t("signUpSchema.usernameMax"))
    .regex(/^[a-z0-9_]+$/, t("signUpSchema.usernameFormat"));

export const signUpSchema = (t: Translator) =>
  z
    .object({
      firstName: z.string().trim().min(2, t("signUpSchema.firstNameMin")).max(100, t("signUpSchema.firstNameMax")),

      lastName: z.string().trim().min(2, t("signUpSchema.lastNameMin")).max(100, t("signUpSchema.lastNameMax")),

      username: usernameSchema(t),

      email: z.string().trim().toLowerCase().email(t("signUpSchema.emailInvalid")),

      password: z
        .string()
        .min(8, t("signUpSchema.passwordMin"))
        .max(128, t("signUpSchema.passwordMax"))
        .regex(/[a-z]/, t("signUpSchema.passwordLowercase"))
        .regex(/[A-Z]/, t("signUpSchema.passwordUppercase"))
        .regex(/\d/, t("signUpSchema.passwordNumber")),

      confirmPassword: z.string(),

      timezone: z.string(),

      locale: z.enum(locales, t("signUpSchema.localeInvalid")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("signUpSchema.passwordsMismatch"),
      path: ["confirmPassword"],
    });

export const signInSchema = (t: Translator) =>
  z.object({
    email: z.string().trim().toLowerCase().email(t("signInSchema.emailInvalid")),

    password: z.string().min(1, t("signInSchema.passwordRequired")),
  });

export const updateMeSchema = (t: Translator) =>
  z
    .object({
      username: usernameSchema(t).optional(),
      locale: z.enum(locales, t("updateMeSchema.localeInvalid")).optional(),
      timezone: z.string().min(1, t("updateMeSchema.timezoneRequired")).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, t("updateMeSchema.atLeastOneField"));

export type SignUpDto = z.infer<ReturnType<typeof signUpSchema>>;
export type SignInDto = z.infer<ReturnType<typeof signInSchema>>;
export type UpdateMeDto = z.infer<ReturnType<typeof updateMeSchema>>;
