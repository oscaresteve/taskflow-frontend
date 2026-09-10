"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { useUpdateTask } from "@/hooks/use-update-task";
import { ApiError } from "@/lib/http/api-error";
import { UpdateTaskAssigneeDto, updateTaskAssigneeSchema } from "@/lib/schemas/task.schema";

interface TaskAssigneeSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  assigneeId: string | null;
}

export function TaskAssigneeSection({
  workspaceSlug,
  projectSlug,
  taskNumber,
  assigneeId,
}: TaskAssigneeSectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);
  const form = useForm<UpdateTaskAssigneeDto>({
    resolver: zodResolver(updateTaskAssigneeSchema),
    defaultValues: { assigneeId },
  });

  useEffect(() => {
    form.reset({ assigneeId });
  }, [assigneeId, form]);

  async function onSubmit(data: UpdateTaskAssigneeDto) {
    try {
      await updateTask.mutateAsync(data);
    } catch (error) {
      form.reset({ assigneeId });
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <Controller
      name="assigneeId"
      control={form.control}
      render={({ field }) => (
        <Field className="w-48">
          <FieldLabel htmlFor="assignee">{t("fields.assignee")}</FieldLabel>
          <AssigneePicker
            id="assignee"
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              form.handleSubmit(onSubmit)();
            }}
          />
        </Field>
      )}
    />
  );
}
