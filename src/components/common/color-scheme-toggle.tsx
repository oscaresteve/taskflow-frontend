"use client";

import { ICONS } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent, ActionsMenuItem } from "@/components/common/actions-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslations } from "next-intl";

export function ColorSchemeToggle() {
  const { setColorScheme } = useColorScheme();
  const t = useTranslations("common");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" aria-label={t("colorSchemeToggle.toggleTheme")} />}
            />
          }
        >
          <ICONS.themeLight className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <ICONS.themeDark className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </TooltipTrigger>
        <TooltipContent>{t("colorSchemeToggle.toggleTheme")}</TooltipContent>
      </Tooltip>
      <ActionsMenuContent align="end">
        <ActionsMenuItem onClick={() => setColorScheme("light")}>
          <ICONS.themeLight />
          {t("colorSchemeToggle.light")}
        </ActionsMenuItem>
        <ActionsMenuItem onClick={() => setColorScheme("dark")}>
          <ICONS.themeDark />
          {t("colorSchemeToggle.dark")}
        </ActionsMenuItem>
        <ActionsMenuItem onClick={() => setColorScheme("system")}>
          <ICONS.themeSystem />
          {t("colorSchemeToggle.system")}
        </ActionsMenuItem>
      </ActionsMenuContent>
    </DropdownMenu>
  );
}
