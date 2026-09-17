"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { DueDatePicker } from "@/components/tasks/due-date-picker";
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
      toast.add({ type: "success", description: t("dueDateUpdated") });
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
        <Field orientation="horizontal">
          <FieldLabel htmlFor="dueDate" className="flex-none! w-28">
            {t("fields.dueDate")}
          </FieldLabel>
          <DueDatePicker
            id="dueDate"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              form.handleSubmit(onSubmit)();
            }}
            className="flex-1"
          />
        </Field>
      )}
    />
  );
}
