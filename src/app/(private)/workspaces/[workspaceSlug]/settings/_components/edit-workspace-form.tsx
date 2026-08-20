"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useUpdateWorkspace } from "@/hooks/use-update-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { UpdateWorkspaceDto, updateWorkspaceSchema } from "@/lib/schemas/workspace.schema";

export function EditWorkspaceForm() {
  const router = useRouter();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const updateWorkspace = useUpdateWorkspace(workspaceSlug);

  const form = useForm<UpdateWorkspaceDto>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (workspace) {
      form.reset({
        name: workspace.name,
        description: workspace.description ?? "",
      });
    }
  }, [workspace, form]);

  async function onSubmit(data: UpdateWorkspaceDto) {
    try {
      const updatedWorkspace = await updateWorkspace.mutateAsync(data);
      router.push(`/workspaces/${updatedWorkspace.slug}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Failed to load workspace.</p>;
  }

  if (isLoading || !workspace) {
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
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input {...field} aria-invalid={fieldState.invalid} id="name" type="text" placeholder="Acme Inc" />
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
                placeholder="Acme Inc's main workspace"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={updateWorkspace.isPending}>
            Save changes
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
