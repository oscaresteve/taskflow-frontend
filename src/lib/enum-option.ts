import type { LucideIcon } from "lucide-react";
import type { EnumColors } from "@/lib/enum-colors";

export interface EnumOption {
  label: string;
  icon: LucideIcon;
  description?: string;
  colors: EnumColors;
  chartColor?: string;
}
