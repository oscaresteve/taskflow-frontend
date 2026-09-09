export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Compara por prefijo ("es-MX" -> "es") contra la lista de locales soportados.
export function normalizeLocale(locale: string | null | undefined): Locale {
  if (!locale) return defaultLocale;

  const lower = locale.toLowerCase();
  const match = locales.find((candidate) => lower === candidate || lower.startsWith(`${candidate}-`));

  return match ?? defaultLocale;
}
