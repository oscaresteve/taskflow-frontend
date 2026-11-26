"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { filteringClasses, neutralColors } from "@/lib/enum-colors";
import { ICONS } from "@/lib/icons";

// Campo y sentido en un control: eran dos cajas permanentes en la esquina de la barra y le quitaban
// el sitio a los filtros. Se enmarca igual que ellos cuando la lista no viene en su orden de
// siempre, con la paleta neutra, pero no reutiliza EnumControl: ese traduce un labelKey de enum y
// aqui la etiqueta es un nombre de campo.
export function SortControl<TField extends string>({
  field,
  order,
  options,
  isDefault,
  onFieldChange,
  onOrderChange,
}: {
  field: TField;
  order: SortOrder;
  options: { value: TField; label: string }[];
  isDefault: boolean;
  onFieldChange: (value: TField) => void;
  onOrderChange: (value: SortOrder) => void;
}) {
  const t = useTranslations("common");
  const OrderIcon = order === "asc" ? ICONS.sortAsc : ICONS.sortDesc;
  const fieldLabel = options.find((option) => option.value === field)?.label;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant={isDefault ? "ghost" : "outline"}
                  className={isDefault ? undefined : filteringClasses(neutralColors)}
                  aria-label={`${t("sort.label")}: ${fieldLabel}`}
                />
              }
            />
          }
        >
          <OrderIcon />
          {fieldLabel}
          <ICONS.expand className="size-4 shrink-0 opacity-60" />
        </TooltipTrigger>
        <TooltipContent>{t("sort.label")}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="min-w-max">
        <DropdownMenuRadioGroup value={field} onValueChange={(next) => next && onFieldChange(next as TField)}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} closeOnClick>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={order} onValueChange={(next) => next && onOrderChange(next as SortOrder)}>
          <DropdownMenuRadioItem value="asc" closeOnClick>
            <ICONS.sortAsc />
            {t("sort.ascending")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc" closeOnClick>
            <ICONS.sortDesc />
            {t("sort.descending")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
