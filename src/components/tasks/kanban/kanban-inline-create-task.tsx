"use client";

import { KeyboardEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ICONS } from "@/lib/icons";
import { ApiError } from "@/lib/http/api-error";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { DueDatePicker } from "@/components/tasks/due-date-picker";
import { CreateTaskDto, createTaskSchema } from "@/lib/schemas/task.schema";
import { TaskStatus } from "@/lib/dtos/tasks.dto";
import { useCreateTask } from "@/hooks/use-create-task";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KanbanInlineCreateTaskProps {
  workspaceSlug: string;
  projectSlug: string;
  status: TaskStatus;
}

export function KanbanInlineCreateTask({ workspaceSlug, projectSlug, status }: KanbanInlineCreateTaskProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const createTask = useCreateTask(workspaceSlug, projectSlug);

  const form = useForm<CreateTaskDto>({
    resolver: zodResolver(createTaskSchema(t)),
    defaultValues: { title: "", description: "", priority: "MEDIUM", assigneeId: undefined, dueDate: undefined },
  });

  function startEditing() {
    form.reset();
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

  async function onSubmit(data: CreateTaskDto) {
    try {
      await createTask.mutateAsync({ ...data, status });
      form.reset();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (!editing) {
    return (
      <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={startEditing}>
        <ICONS.addNew />
        {t("kanbanColumn.addTask")}
      </Button>
    );
  }

  return (
    <Card size="sm" className="gap-2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
        <div className="px-(--card-spacing)">
          <Field data-invalid={!!form.formState.errors.title}>
            <Input
              autoFocus
              type="text"
              placeholder={t("createTaskDialog.titlePlaceholder")}
              aria-label={t("fields.title")}
              disabled={form.formState.isSubmitting}
              {...form.register("title")}
              onKeyDown={handleKeyDown}
            />
            {form.formState.errors.title && <FieldError errors={[form.formState.errors.title]} />}
          </Field>
        </div>
        <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
          <span className="flex items-center gap-1">
            <Controller
              name="priority"
              control={form.control}
              render={({ field }) => (
                <PrioritySelect variant="icon" value={field.value} onValueChange={field.onChange} />
              )}
            />
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <DueDatePicker
                  variant="icon"
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value ?? undefined)}
                />
              )}
            />
          </span>
          <span className="flex items-center gap-1">
            <Controller
              name="assigneeId"
              control={form.control}
              render={({ field }) => (
                <AssigneePicker
                  variant="avatar"
                  workspaceSlug={workspaceSlug}
                  projectSlug={projectSlug}
                  value={field.value ?? null}
                  onChange={(userId) => field.onChange(userId ?? undefined)}
                />
              )}
            />
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={cancel}
                    disabled={form.formState.isSubmitting}
                    aria-label={tCommon("actions.cancel")}
                  />
                }
              >
                <ICONS.cancel aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>{tCommon("actions.cancel")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="submit"
                    size="icon-sm"
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                    aria-label={tCommon("actions.save")}
                  />
                }
              >
                {form.formState.isSubmitting ? (
                  <ICONS.loading className="animate-spin" aria-hidden="true" />
                ) : (
                  <ICONS.confirm aria-hidden="true" />
                )}
              </TooltipTrigger>
              <TooltipContent>{tCommon("actions.save")}</TooltipContent>
            </Tooltip>
          </span>
        </div>
      </form>
    </Card>
  );
}
