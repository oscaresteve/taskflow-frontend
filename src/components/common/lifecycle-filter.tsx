"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Icon } from "@/lib/icons";

export interface LifecycleOption<TValue extends string> {
  value: TValue;
  label: string;
  icon: Icon;
  count?: number;
}

interface LifecycleFilterProps<TValue extends string> {
  value: TValue;
  onValueChange: (value: TValue) => void;
  options: readonly LifecycleOption<TValue>[];
}

// El subconjunto del ciclo de vida (activos / archivados / pendientes / eliminados) no es un sitio
// al que vas, es lo que estas mirando de lo mismo: va en la barra de herramientas con los demas
// filtros y no en pestanas, que competian con la fila de navegacion de arriba y se leian como un
// segundo nivel de secciones. Nunca un desplegable: el subconjunto tiene que verse de un vistazo.
export function LifecycleFilter<TValue extends string>({
  value,
  onValueChange,
  options,
}: LifecycleFilterProps<TValue>) {
  const t = useTranslations("common");

  // Con un solo segmento no hay nada que elegir: a quien no puede devolver lo muerto no se le
  // ensena un control de una sola opcion.
  if (options.length < 2) {
    return null;
  }

  return (
    <ToggleGroup
      variant="outline"
      spacing={0}
      aria-label={t("lifecycleFilter.label")}
      value={[value]}
      // Sin el guardia, volver a pulsar el segmento activo lo deseleccionaria y dejaria la vista
      // sin subconjunto; aqui siempre hay uno.
      onValueChange={([next]) => next && onValueChange(next as TValue)}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} aria-label={option.label}>
          <option.icon />
          {option.label}
          {typeof option.count === "number" && <Badge variant="secondary">{option.count}</Badge>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
