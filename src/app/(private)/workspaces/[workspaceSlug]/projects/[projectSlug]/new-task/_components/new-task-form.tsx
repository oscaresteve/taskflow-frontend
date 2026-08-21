"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useCreateTask } from "@/hooks/use-create-task";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { CreateTaskDto, createTaskSchema, taskPriorities } from "@/lib/schemas/task.schema";

const UNASSIGNED = "unassigned";

export function NewTaskForm() {
  const router = useRouter();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const createTask = useCreateTask(workspaceSlug, projectSlug);

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

  async function onSubmit(data: CreateTaskDto) {
    try {
      await createTask.mutateAsync(data);
      router.push(`/workspaces/${workspaceSlug}/projects/${projectSlug}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Failed to load project.</p>;
  }

  if (isLoading || !project) {
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
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="title"
                type="text"
                placeholder="Set up the staging environment"
                required
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
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} id="description" type="text" placeholder="Optional" />
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
                onValueChange={(value) => field.onChange(value === UNASSIGNED ? undefined : value)}
              >
                <SelectTrigger id="assignee" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {project.members.map((member) => (
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
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={createTask.isPending}>
            Create task
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
