"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpdateWorkspace } from "@/hooks/use-update-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { UpdateWorkspaceDto, updateWorkspaceSchema } from "@/lib/schemas/workspace.schema";
import { Loader2Icon } from "lucide-react";

export function EditWorkspaceForm() {
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
      await updateWorkspace.mutateAsync(data);
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
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your workspace&apos;s name and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </FieldGroup>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Update your workspace&apos;s name and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    disabled={updateWorkspace.isPending}
                    id="name"
                    type="text"
                    placeholder="Acme Inc"
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
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={fieldState.invalid}
                    disabled={updateWorkspace.isPending}
                    id="description"
                    placeholder="Acme Inc's main workspace"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={updateWorkspace.isPending}>
            {updateWorkspace.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
