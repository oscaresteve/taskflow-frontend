"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </TooltipTrigger>
        <TooltipContent>{t("colorSchemeToggle.toggleTheme")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setColorScheme("light")}>
          <Sun />
          {t("colorSchemeToggle.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme("dark")}>
          <Moon />
          {t("colorSchemeToggle.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorScheme("system")}>
          <Monitor />
          {t("colorSchemeToggle.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
