"use client";

import { SettingCard } from "@/components/common/setting-card";
import { ICONS } from "@/lib/icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "next-intl";

export function ColorSchemeSection() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mounted = useHasMounted();
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");

  return (
    <SettingCard
      title={t("colorSchemeSection.title")}
      description={t("colorSchemeSection.description")}
      action={
        // El esquema solo se sabe en el cliente, asi que hasta montar no hay nada marcado: es lo
        // mismo que pinta el servidor, y asi el grupo no se duplica para decir solo eso.
        <ToggleGroup
          variant="outline"
          value={mounted && colorScheme ? [colorScheme] : []}
          onValueChange={([next]) => next && setColorScheme(next)}
        >
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.light")} value="light">
            <ICONS.themeLight />
            {tCommon("colorSchemeToggle.light")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.dark")} value="dark">
            <ICONS.themeDark />
            {tCommon("colorSchemeToggle.dark")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.system")} value="system">
            <ICONS.themeSystem />
            {tCommon("colorSchemeToggle.system")}
          </ToggleGroupItem>
        </ToggleGroup>
      }
    />
  );
}
