"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useUpdateTask } from "@/hooks/use-update-task";
import { TaskStatus } from "@/lib/dtos/tasks.dto";
import { ApiError } from "@/lib/http/api-error";
import { UpdateTaskStatusDto, taskStatuses, updateTaskStatusSchema } from "@/lib/schemas/task.schema";
import { statusLabel } from "@/lib/task-labels";

interface TaskStatusSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  status: TaskStatus;
}

export function TaskStatusSection({ workspaceSlug, projectSlug, taskNumber, status }: TaskStatusSectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);
  const form = useForm<UpdateTaskStatusDto>({ resolver: zodResolver(updateTaskStatusSchema), defaultValues: { status } });

  useEffect(() => {
    form.reset({ status });
  }, [status, form]);

  async function onSubmit(data: UpdateTaskStatusDto) {
    try {
      await updateTask.mutateAsync(data);
    } catch (error) {
      form.reset({ status });
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <Controller
      name="status"
      control={form.control}
      render={({ field }) => (
        <Field className="w-40">
          <FieldLabel htmlFor="status">{t("fields.status")}</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              form.handleSubmit(onSubmit)();
            }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabel[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
