"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { filteringClasses, neutralColors } from "@/lib/enum-colors";
import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface LifecycleOption<TValue extends string> {
  value: TValue;
  label: string;
  icon: Icon;
  count?: number;
}

interface LifecycleFilterProps<TValue extends string> {
  value: TValue;
  /** El subconjunto vivo, el que no lleva chip. */
  activeValue: TValue;
  onValueChange: (value: TValue) => void;
  /** Solo los subconjuntos muertos, y solo los que el usuario puede devolver. */
  options: readonly LifecycleOption<TValue>[];
}

// El subconjunto del ciclo de vida (archivados / pendientes / eliminados) no es un sitio al que
// vas, es lo que estas mirando de lo mismo: va con los demas filtros y no en pestanas, que competian
// con la fila de navegacion de arriba. Nunca un desplegable: tiene que verse de un vistazo.
//
// Y lo vivo no lleva chip, igual que los demas filtros no tienen uno para su "todas": verlo es el
// reposo de la pantalla, no algo que pidas. Por eso soltar el chip pulsado vuelve a los vivos.
export function LifecycleFilter<TValue extends string>({
  value,
  activeValue,
  onValueChange,
  options,
}: LifecycleFilterProps<TValue>) {
  const t = useTranslations("common");

  // A quien no puede devolver lo muerto no se le ensena que existe: su vista son los vivos y punto.
  if (options.length === 0) {
    return null;
  }

  return (
    <ToggleGroup
      aria-label={t("lifecycleFilter.label")}
      value={value === activeValue ? [] : [value]}
      onValueChange={([next]) => onValueChange(next ? (next as TValue) : activeValue)}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          // El pulsado del primitivo es el mismo bg-muted que su hover, asi que sin el marco un chip
          // encendido no se distinguia de uno con el raton encima.
          className={cn("gap-1.5", value === option.value && filteringClasses(neutralColors))}
        >
          <option.icon />
          {option.label}
          {typeof option.count === "number" && <Badge variant="secondary">{option.count}</Badge>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
