"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ReactNode } from "react";
import { ICONS, type Icon } from "@/lib/icons";
import { useTranslations } from "next-intl";

/**
 * Tag de resaltado para los titulos con identidad. El titulo va en `font-medium`, asi que el salto
 * a `font-semibold` destaca el nombre sin meter un color que compita con la variante destructiva.
 */
export const richTitleTags = {
  b: (chunks: ReactNode) => <span className="font-semibold">{chunks}</span>,
};

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  Icon?: Icon;
  pending?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = "default",
  Icon = ICONS.info,
  pending = false,
}: ConfirmDialogProps) {
  const t = useTranslations("common");

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel ?? t("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction variant={variant} onClick={onConfirm} disabled={pending}>
            {pending && <ICONS.loading className="animate-spin" aria-hidden="true" />}
            {confirmLabel ?? t("actions.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
