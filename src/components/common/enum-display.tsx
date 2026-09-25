import type { ComponentProps } from "react";
import { ICONS } from "@/lib/icons";
import { useTranslations } from "next-intl";
import type { EnumOption } from "@/lib/enum-option";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EnumBadge({
  option,
  interactive,
  className,
}: {
  option: EnumOption;
  className?: string;
  interactive?: boolean;
}) {
  const t = useTranslations();
  const Icon = option.icon;

  return (
    <span
      className={cn(
        "inline-flex h-5 w-fit shrink-0 items-center gap-1 rounded-sm border px-2 text-xs font-medium whitespace-nowrap font-mono uppercase",
        option.colors.bgSoft,
        option.colors.text,
        interactive ? cn("transition-colors", option.colors.border, option.colors.bgSoftHover) : "border-transparent",
        className,
      )}
    >
      <Icon className="size-3" />
      {t(option.labelKey)}
    </span>
  );
}

export function EnumIconBadge({ option, className }: { option: EnumOption; className?: string }) {
  const t = useTranslations();
  const Icon = option.icon;

  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-sm",
        option.colors.bgSoft,
        option.colors.text,
        className,
      )}
    >
      <Icon className="size-3" />
      <span className="sr-only">{t(option.labelKey)}</span>
    </span>
  );
}

export function EnumIconControl({
  option,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button> & { option: EnumOption }) {
  const t = useTranslations();
  const Icon = option.icon;

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(option.colors.text, option.colors.bgSoftHover, className)}
      {...props}
    >
      <Icon />
      <span className="sr-only">{t(option.labelKey)}</span>
    </Button>
  );
}

export function EnumIconLabel({ option, className }: { option: EnumOption; className?: string }) {
  const t = useTranslations();
  const Icon = option.icon;

  return (
    <span className={cn("flex items-center gap-1.5 font-mono uppercase", option.colors.text, className)}>
      <Icon className="size-4" />
      {t(option.labelKey)}
    </span>
  );
}

export function EnumControl({
  option,
  className,
  variant = "outline",
  size = "default",
  ...props
}: ComponentProps<typeof Button> & { option: EnumOption }) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        option.colors.border,
        option.colors.bgSoft,
        option.colors.text,
        option.colors.bgSoftHover,
        className,
      )}
      {...props}
    >
      <EnumIconLabel option={option} />
      <ICONS.expand className="size-4 shrink-0 opacity-60" />
    </Button>
  );
}
