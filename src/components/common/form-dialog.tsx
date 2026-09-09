"use client";

import { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  media?: ReactNode;
  formId: string;
  submitLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  children: ReactNode;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  media,
  formId,
  submitLabel,
  cancelLabel,
  pending = false,
  children,
}: FormDialogProps) {
  const t = useTranslations("common");

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader className="items-center text-center">
          {media}
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            {cancelLabel ?? t("actions.cancel")}
          </Button>
          <Button type="submit" form={formId} disabled={pending}>
            {pending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {submitLabel ?? t("actions.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
