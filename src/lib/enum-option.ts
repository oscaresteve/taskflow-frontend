import type { LucideIcon } from "lucide-react";
import type { EnumColors } from "@/lib/enum-colors";

export interface EnumOption {
  /** Clave completa de next-intl (ej. "tasks.priority.URGENT"): se traduce al pintar. */
  labelKey: string;
  icon: LucideIcon;
  descriptionKey?: string;
  colors: EnumColors;
  chartColor?: string;
}
