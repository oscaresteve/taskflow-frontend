"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SettingCard } from "@/components/common/setting-card";
import { toast } from "@/components/ui/toast";
import { useUpdateWorkspace } from "@/hooks/use-update-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { Loader2Icon } from "lucide-react";
import { descriptionSchema } from "@/lib/schemas/common.schema";
import z from "zod";

const workspaceDescriptionSchema = z.object({
  description: descriptionSchema.nullable(),
});

type WorkspaceDescriptionFormValues = z.infer<typeof workspaceDescriptionSchema>;

export function WorkspaceDescriptionSection() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const updateWorkspace = useUpdateWorkspace(workspaceSlug);

  const form = useForm<WorkspaceDescriptionFormValues>({
    resolver: zodResolver(workspaceDescriptionSchema),
    defaultValues: { description: "" },
  });

  useEffect(() => {
    if (workspace) {
      form.reset({ description: workspace.description ?? "" });
    }
  }, [workspace, form]);

  async function onSubmit(data: WorkspaceDescriptionFormValues) {
    try {
      await updateWorkspace.mutateAsync(data);
      toast.add({ type: "success", description: "Workspace description updated." });
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
      <SettingCard title="Description" description="A short description of your workspace.">
        <Skeleton className="h-16 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title="Description"
        description="A short description of your workspace."
        footerHint="Max 500 characters"
        footer={
          <Button type="submit" disabled={updateWorkspace.isPending}>
            {updateWorkspace.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            Save
          </Button>
        }
      >
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Textarea
                {...field}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                aria-label="Description"
                disabled={updateWorkspace.isPending}
                id="description"
                placeholder="Acme Inc's main workspace"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
