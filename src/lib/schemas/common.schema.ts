import z from "zod";
import type { useTranslations } from "next-intl";

// Derivado del propio hook: si next-intl cambia la firma de t(), este tipo se actualiza solo.
export type Translator = ReturnType<typeof useTranslations>;

// Reutilizable entre dominios: cada namespace que la usa (workspaces, projects, tasks) define su
// propia clave validation.descriptionMaxLength, asi el schema solo necesita el
// traductor del propio dominio en vez de tener que inyectar tambien el de "common".
export const descriptionSchema = (t: Translator) =>
  z.string().trim().max(500, t("validation.descriptionMaxLength")).optional();
