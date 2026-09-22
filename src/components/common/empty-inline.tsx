import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import type { Icon } from "@/lib/icons";

interface EmptyInlineProps extends ComponentProps<"div"> {
  icon?: Icon;
  label: string;
  variant?: "xs" | "sm";
}

export function EmptyInline({ icon: IconComponent, label, className, variant = "sm", ...props }: EmptyInlineProps) {
  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)} {...props}>
      {IconComponent && <IconComponent className="size-3.5 shrink-0" />}
      {label}
    </div>
  );
}
