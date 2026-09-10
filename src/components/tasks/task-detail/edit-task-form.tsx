"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useUpdateTask } from "@/hooks/use-update-task";
import { ApiError } from "@/lib/http/api-error";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { UpdateTaskDto, taskPriorities, taskStatuses, updateTaskSchema } from "@/lib/schemas/task.schema";
import { statusLabel } from "@/lib/task-labels";
import { getFullName } from "@/lib/utils";
import { useTranslations } from "next-intl";

const UNASSIGNED = "unassigned";

interface EditTaskFormProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}

export function EditTaskForm({ workspaceSlug, projectSlug, taskNumber }: EditTaskFormProps) {
  const { data: task, isLoading, isError } = useQuery(getTaskQuery({ workspaceSlug, projectSlug, taskNumber }));
  const t = useTranslations("tasks");
  const { data: projectMembers } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));
  const members = projectMembers ?? [];
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);

  const form = useForm<UpdateTaskDto>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: null,
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
      });
    }
  }, [task, form]);

  async function onSubmit(data: UpdateTaskDto) {
    try {
      await updateTask.mutateAsync(data);
      toast.add({ type: "success", description: t("editTaskForm.saveSuccess") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("taskPage.failedToLoadTask")}</p>;
  }

  if (isLoading || !task) {
    return (
      <FieldGroup>
        <Skeleton className="h-9 w-full" />
      </FieldGroup>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="flex flex-wrap gap-3">
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-40">
                <FieldLabel htmlFor="status">{t("fields.status")}</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={fieldState.invalid} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabel[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-40">
                <FieldLabel htmlFor="priority">{t("fields.priority")}</FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="priority" aria-invalid={fieldState.invalid} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="assigneeId"
            control={form.control}
            render={({ field }) => (
              <Field className="w-48">
                <FieldLabel htmlFor="assignee">{t("fields.assignee")}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? UNASSIGNED}
                  onValueChange={(value) => field.onChange(value === UNASSIGNED ? null : value)}
                >
                  <SelectTrigger id="assignee" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UNASSIGNED}>{t("fields.unassigned")}</SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {getFullName(member.user.firstName, member.user.lastName)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-40">
                <FieldLabel htmlFor="dueDate">{t("fields.dueDate")}</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  id="dueDate"
                  type="date"
                  value={field.value ? field.value.slice(0, 10) : ""}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Field>
          <Button
            type="submit"
            disabled={updateTask.isPending || !form.formState.isDirty}
            className="self-start"
          >
            {t("editTaskForm.saveChanges")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
