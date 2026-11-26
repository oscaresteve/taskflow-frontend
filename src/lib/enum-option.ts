import type { Icon } from "@/lib/icons";
import type { EnumColors } from "@/lib/enum-colors";

export interface EnumOption {
  /** Clave completa de next-intl (ej. "tasks.priority.URGENT"): se traduce al pintar. */
  labelKey: string;
  icon: Icon;
  descriptionKey?: string;
  colors: EnumColors;
  chartColor?: string;
}
