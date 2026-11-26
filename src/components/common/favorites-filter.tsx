"use client";

import { useTranslations } from "next-intl";
import { Toggle } from "@/components/ui/toggle";
import { filteringClasses, neutralColors } from "@/lib/enum-colors";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";

// Acotar a los favoritos es un si o no, asi que es un toggle y no un select. En reposo es un ghost
// mas de la barra y solo se enmarca mientras filtra, igual que los chips del ciclo de vida: verlo
// todo es el reposo de la pantalla, no algo que se pida.
export function FavoritesFilter({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const t = useTranslations("common");

  return (
    <Toggle
      pressed={value}
      onPressedChange={onValueChange}
      className={cn(value && filteringClasses(neutralColors))}
    >
      <ICONS.favorite className={cn(value && "fill-current")} />
      {t("favoritesFilter.label")}
    </Toggle>
  );
}
