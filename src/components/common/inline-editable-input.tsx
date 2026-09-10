"use client";

import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { cn } from "@/lib/utils";

interface InlineEditableInputProps {
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

export function InlineEditableInput({
  value,
  onSave,
  ariaLabel,
  schema,
  placeholder,
  emptyLabel,
  className,
}: InlineEditableInputProps) {
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
      e.preventDefault();
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
          "-mx-2 block w-full rounded-md px-2 py-1 text-left hover:bg-accent",
          !value && "text-muted-foreground",
          className
        )}
      >
        {value || emptyLabel}
      </button>
    );
  }

  const fieldState = form.formState.errors.value;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Field data-invalid={!!fieldState}>
        <Input
          autoFocus
          type="text"
          {...form.register("value")}
          onKeyDown={handleKeyDown}
          aria-invalid={!!fieldState}
          aria-label={ariaLabel}
          placeholder={placeholder}
          disabled={form.formState.isSubmitting}
          className={className}
        />
        {fieldState && <FieldError errors={[fieldState]} />}
      </Field>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={cancel}
          disabled={form.formState.isSubmitting}
        >
          <XIcon aria-hidden="true" />
          <span className="sr-only">{t("actions.cancel")}</span>
        </Button>
        <Button type="submit" size="icon-sm" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
          {form.formState.isSubmitting ? (
            <Loader2Icon className="animate-spin" aria-hidden="true" />
          ) : (
            <CheckIcon aria-hidden="true" />
          )}
          <span className="sr-only">{t("actions.save")}</span>
        </Button>
      </div>
    </form>
  );
}
