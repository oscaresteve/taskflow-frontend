"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useUpdateTask } from "@/hooks/use-update-task";
import { TaskPriority } from "@/lib/dtos/tasks.dto";
import { ApiError } from "@/lib/http/api-error";
import { UpdateTaskPriorityDto, taskPriorities, updateTaskPrioritySchema } from "@/lib/schemas/task.schema";

interface TaskPrioritySectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  priority: TaskPriority;
}

export function TaskPrioritySection({ workspaceSlug, projectSlug, taskNumber, priority }: TaskPrioritySectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);
  const form = useForm<UpdateTaskPriorityDto>({
    resolver: zodResolver(updateTaskPrioritySchema),
    defaultValues: { priority },
  });

  useEffect(() => {
    form.reset({ priority });
  }, [priority, form]);

  async function onSubmit(data: UpdateTaskPriorityDto) {
    try {
      await updateTask.mutateAsync(data);
      toast.add({ type: "success", description: t("updateSuccess") });
    } catch (error) {
      form.reset({ priority });
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <Controller
      name="priority"
      control={form.control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <FieldLabel htmlFor="priority">{t("fields.priority")}</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              form.handleSubmit(onSubmit)();
            }}
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {taskPriorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}
