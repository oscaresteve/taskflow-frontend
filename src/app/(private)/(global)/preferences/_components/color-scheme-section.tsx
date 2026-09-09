"use client";

import { SettingCard } from "@/components/common/setting-card";
import { Monitor, Moon, Sun } from "lucide-react";
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
      footerHint={t("colorSchemeSection.footerHint")}
      orientation="horizontal"
    >
      {mounted ? (
        <ToggleGroup
          variant="outline"
          value={colorScheme ? [colorScheme] : []}
          onValueChange={([next]) => next && setColorScheme(next)}
        >
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.light")} value="light">
            <Sun />
            {tCommon("colorSchemeToggle.light")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.dark")} value="dark">
            <Moon />
            {tCommon("colorSchemeToggle.dark")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.system")} value="system">
            <Monitor />
            {tCommon("colorSchemeToggle.system")}
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <ToggleGroup variant="outline" value={[]}>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.light")} value="light">
            <Sun />
            {tCommon("colorSchemeToggle.light")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.dark")} value="dark">
            <Moon />
            {tCommon("colorSchemeToggle.dark")}
          </ToggleGroupItem>
          <ToggleGroupItem aria-label={tCommon("colorSchemeToggle.system")} value="system">
            <Monitor />
            {tCommon("colorSchemeToggle.system")}
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </SettingCard>
  );
}
