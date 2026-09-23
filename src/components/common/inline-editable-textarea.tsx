"use client";

import { FocusEvent, KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { focusLeftForm } from "@/lib/inline-edit";
import { cn } from "@/lib/utils";

interface InlineEditableTextareaProps {
  value: string;
  onSave: (value: string) => Promise<unknown>;
  ariaLabel: string;
  schema: z.ZodType<string, string>;
  placeholder?: string;
  emptyLabel?: string;
  className?: string;
}

interface FormValues {
  value: string;
}

export function InlineEditableTextarea({
  value,
  onSave,
  ariaLabel,
  schema,
  placeholder,
  emptyLabel,
  className,
}: InlineEditableTextareaProps) {
  const t = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(z.object({ value: schema })),
    defaultValues: { value },
  });

  function startEditing() {
    form.reset({ value });
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      cancel();
    }
  }

  function handleBlur(e: FocusEvent<HTMLFormElement>) {
    if (form.formState.isSubmitting) {
      return;
    }
    if (focusLeftForm(e)) {
      cancel();
    }
  }

  async function onSubmit(data: FormValues) {
    if (!form.formState.isDirty) {
      setEditing(false);
      return;
    }
    try {
      await onSave(data.value);
      setEditing(false);
    } catch (err) {
      toast.add({
        type: "error",
        description: err instanceof ApiError ? err.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        aria-label={ariaLabel}
        className={cn(
          "-mx-2 block w-full whitespace-pre-wrap rounded-md px-2 py-1 text-left hover:bg-accent",
          !value && "text-muted-foreground",
          className,
        )}
      >
        {value || emptyLabel}
      </button>
    );
  }

  const fieldState = form.formState.errors.value;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} onBlur={handleBlur} className="flex flex-col gap-2">
      <Field data-invalid={!!fieldState}>
        <Textarea
          autoFocus
          {...form.register("value")}
          onKeyDown={handleKeyDown}
          aria-invalid={!!fieldState}
          aria-label={ariaLabel}
          placeholder={placeholder}
          disabled={form.formState.isSubmitting}
        />
        {fieldState && <FieldError errors={[fieldState]} />}
      </Field>
      <div className="flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={cancel}
                disabled={form.formState.isSubmitting}
                aria-label={t("actions.cancel")}
              />
            }
          >
            <ICONS.cancel aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>{t("actions.cancel")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="submit"
                size="icon-sm"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                aria-label={t("actions.save")}
              />
            }
          >
            {form.formState.isSubmitting ? (
              <ICONS.loading className="animate-spin" aria-hidden="true" />
            ) : (
              <ICONS.confirm aria-hidden="true" />
            )}
          </TooltipTrigger>
          <TooltipContent>{t("actions.save")}</TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
}
