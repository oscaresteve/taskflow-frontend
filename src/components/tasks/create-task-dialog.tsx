"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { DueDatePicker } from "@/components/tasks/due-date-picker";
import { EnumBadge } from "@/components/common/enum-display";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { FormDialog } from "@/components/common/form-dialog";
import { useCreateTask } from "@/hooks/use-create-task";
import { ApiError } from "@/lib/http/api-error";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { CreateTaskDto, createTaskSchema } from "@/lib/schemas/task.schema";
import { priorityOptions } from "@/lib/task-enums";
import { useTranslations } from "next-intl";

interface CreateTaskDialogProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ workspaceSlug, project, open, onOpenChange }: CreateTaskDialogProps) {
  const router = useRouter();
  const createTask = useCreateTask(workspaceSlug, project.slug);
  const t = useTranslations("tasks");

  const form = useForm<CreateTaskDto>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      assigneeId: undefined,
      dueDate: undefined,
    },
  });

  const priority = useWatch({ control: form.control, name: "priority" });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(data: CreateTaskDto) {
    try {
      await createTask.mutateAsync(data);
      onOpenChange(false);
      router.push(`/workspaces/${workspaceSlug}/projects/${project.slug}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("createTaskDialog.title")}
      description={t("createTaskDialog.description")}
      formId="create-task-form"
      submitLabel={t("createTaskDialog.submit")}
      pending={createTask.isPending}
      media={<EnumBadge option={priorityOptions[priority]} />}
    >
      <form id="create-task-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-title">{t("fields.title")}</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="task-title"
                  type="text"
                  placeholder={t("createTaskDialog.titlePlaceholder")}
                  required
                  autoFocus
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-description">{t("fields.description")}</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="task-description"
                  placeholder={t("fields.descriptionPlaceholder")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-priority">{t("fields.priority")}</FieldLabel>
                <PrioritySelect
                  id="task-priority"
                  className="w-full"
                  value={field.value}
                  onValueChange={field.onChange}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="assigneeId"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="task-assignee">{t("fields.assignee")}</FieldLabel>
                <AssigneePicker
                  id="task-assignee"
                  workspaceSlug={workspaceSlug}
                  projectSlug={project.slug}
                  value={field.value ?? null}
                  onChange={(userId) => field.onChange(userId ?? undefined)}
                />
              </Field>
            )}
          />
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-due-date">{t("fields.dueDate")}</FieldLabel>
                <DueDatePicker
                  id="task-due-date"
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value ?? undefined)}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
