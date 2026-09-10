"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useUpdateTask } from "@/hooks/use-update-task";
import { ApiError } from "@/lib/http/api-error";
import { UpdateTaskDueDateDto, updateTaskDueDateSchema } from "@/lib/schemas/task.schema";

interface TaskDueDateSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  dueDate: string | null;
}

export function TaskDueDateSection({ workspaceSlug, projectSlug, taskNumber, dueDate }: TaskDueDateSectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);
  const form = useForm<UpdateTaskDueDateDto>({
    resolver: zodResolver(updateTaskDueDateSchema),
    defaultValues: { dueDate },
  });

  useEffect(() => {
    form.reset({ dueDate });
  }, [dueDate, form]);

  async function onSubmit(data: UpdateTaskDueDateDto) {
    try {
      await updateTask.mutateAsync(data);
    } catch (error) {
      form.reset({ dueDate });
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <Controller
      name="dueDate"
      control={form.control}
      render={({ field }) => (
        <Field className="w-40">
          <FieldLabel htmlFor="dueDate">{t("fields.dueDate")}</FieldLabel>
          <Input
            id="dueDate"
            type="date"
            value={field.value ? field.value.slice(0, 10) : ""}
            onChange={(e) => {
              const value = e.target.value ? new Date(e.target.value).toISOString() : null;
              field.onChange(value);
              form.handleSubmit(onSubmit)();
            }}
          />
        </Field>
      )}
    />
  );
}
