"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/common/form-dialog";
import { useCreateTask } from "@/hooks/use-create-task";
import { ApiError } from "@/lib/http/api-error";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { CreateTaskDto, createTaskSchema, taskPriorities } from "@/lib/schemas/task.schema";
import { priorityVariant } from "@/lib/task-labels";
import { getFullName } from "@/lib/utils";
import { useTranslations } from "next-intl";

const UNASSIGNED = "unassigned";

interface CreateTaskDialogProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  members: ProjectMemberWithUserResponseDto[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ workspaceSlug, project, members, open, onOpenChange }: CreateTaskDialogProps) {
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
      media={<Badge variant={priorityVariant[priority]}>{priority}</Badge>}
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
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-priority" aria-invalid={fieldState.invalid} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorities.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
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
              <Field>
                <FieldLabel htmlFor="task-assignee">{t("fields.assignee")}</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? UNASSIGNED}
                  onValueChange={(value) => field.onChange(value === UNASSIGNED ? undefined : value)}
                >
                  <SelectTrigger id="task-assignee" className="w-full">
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
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-due-date">{t("fields.dueDate")}</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  id="task-due-date"
                  type="date"
                  value={field.value ? field.value.slice(0, 10) : ""}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
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
