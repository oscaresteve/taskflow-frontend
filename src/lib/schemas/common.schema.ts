import z from "zod";
import type { useTranslations } from "next-intl";

// Derivado del propio hook: si next-intl cambia la firma de t(), este tipo se actualiza solo.
export type Translator = ReturnType<typeof useTranslations>;

// Reutilizable entre dominios: cada namespace que la usa (workspaces, projects, tasks) define su
// propia clave validation.descriptionMaxLength, asi el schema solo necesita el
// traductor del propio dominio en vez de tener que inyectar tambien el de "common".
export const descriptionSchema = (t: Translator) =>
  z.string().trim().max(500, t("validation.descriptionMaxLength")).optional();

// Límites de avatar, deben coincidir con el backend
// (workspaces.schema.ts, AVATAR_EXTENSION_BY_CONTENT_TYPE / MAX_AVATAR_SIZE_BYTES).
export const AVATAR_ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
