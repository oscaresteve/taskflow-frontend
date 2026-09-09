"use client";

import { SettingCard } from "@/components/common/setting-card";
import { Monitor, Moon, Sun } from "lucide-react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ColorSchemeSection() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mounted = useHasMounted();

  return (
    <SettingCard
      title="Color scheme"
      description="Choose how TaskFlow looks on this device."
      footerHint="Changes are applied immediately."
      orientation="horizontal"
    >
      {mounted ? (
        <ToggleGroup
          variant="outline"
          value={colorScheme ? [colorScheme] : []}
          onValueChange={([next]) => next && setColorScheme(next)}
        >
          <ToggleGroupItem aria-label="Light" value="light">
            <Sun />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Dark" value="dark">
            <Moon />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="System" value="system">
            <Monitor />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <ToggleGroup variant="outline" value={[]}>
          <ToggleGroupItem aria-label="Light" value="light">
            <Sun />
            Light
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Dark" value="dark">
            <Moon />
            Dark
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="System" value="system">
            <Monitor />
            System
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </SettingCard>
  );
}
