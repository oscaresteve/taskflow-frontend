"use client";

import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { es, enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

const locales = {
  en: enUS,
  es: es,
};

export function LocalizedCalendar(props: ComponentProps<typeof Calendar>) {
  const activeLocale = useLocale();
  const currentLocale = locales[activeLocale as keyof typeof locales] || enUS;

  return <Calendar locale={currentLocale} {...props} />;
}
