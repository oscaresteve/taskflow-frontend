"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
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
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { UpdateTaskDto, taskPriorities, taskStatuses, updateTaskSchema } from "@/lib/schemas/task.schema";
import { statusLabel } from "@/lib/task-labels";

const UNASSIGNED = "unassigned";

export function EditTaskForm() {
  const { workspaceSlug, projectSlug, taskNumber } = useParams<{
    workspaceSlug: string;
    projectSlug: string;
    taskNumber: string;
  }>();
  const { data: task, isLoading, isError } = useQuery(getTaskQuery({ workspaceSlug, projectSlug, taskNumber }));
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);

  const form = useForm<UpdateTaskDto>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      assigneeId: null,
      dueDate: null,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description ?? "",
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
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Failed to load task.</p>;
  }

  if (isLoading || !task) {
    return (
      <FieldGroup>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </FieldGroup>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} id="title" type="text" required />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                id="description"
                type="text"
                placeholder="Optional"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="status">Status</FieldLabel>
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
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="priority">Priority</FieldLabel>
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
            <Field>
              <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
              <Select
                name={field.name}
                value={field.value ?? UNASSIGNED}
                onValueChange={(value) => field.onChange(value === UNASSIGNED ? null : value)}
              >
                <SelectTrigger id="assignee" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {project?.members.map((member) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user.name}
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
              <FieldLabel htmlFor="dueDate">Due date</FieldLabel>
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
        <Field>
          <Button type="submit" disabled={updateTask.isPending}>
            Save changes
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
