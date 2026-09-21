"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentProps } from "react";

interface FavoriteToggleProps extends Pick<ComponentProps<typeof Button>, "size" | "variant"> {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
}

export function FavoriteToggle({
  isFavorite,
  onToggle,
  disabled,
  className,
  variant = "ghost",
  size = "icon-sm",
}: FavoriteToggleProps) {
  const t = useTranslations("common");
  const label = isFavorite ? t("actions.removeFromFavorites") : t("actions.addToFavorites");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant={variant}
            size={size}
            onClick={onToggle}
            disabled={disabled}
            aria-label={label}
            aria-pressed={isFavorite}
            className={cn("text-muted-foreground", className)}
          />
        }
      >
        <ICONS.favorite className={cn(isFavorite && "fill-current")} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
