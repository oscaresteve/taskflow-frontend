"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingCard } from "@/components/common/setting-card";
import { toast } from "@/components/ui/toast";
import { useUpdateWorkspace } from "@/hooks/use-update-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { UpdateWorkspaceNameDto, updateWorkspaceNameSchema } from "@/lib/schemas/workspace.schema";
import { Loader2Icon } from "lucide-react";

export function WorkspaceNameSection() {
  const router = useRouter();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const updateWorkspace = useUpdateWorkspace(workspaceSlug);

  const form = useForm<UpdateWorkspaceNameDto>({
    resolver: zodResolver(updateWorkspaceNameSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (workspace) {
      form.reset({ name: workspace.name });
    }
  }, [workspace, form]);

  async function onSubmit(data: UpdateWorkspaceNameDto) {
    try {
      const updatedWorkspace = await updateWorkspace.mutateAsync(data);
      toast.add({ type: "success", description: "Workspace name updated." });
      if (updatedWorkspace.slug !== workspaceSlug) {
        router.replace(`/workspaces/${updatedWorkspace.slug}/settings`);
      }
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
      <SettingCard title="Workspace name" description="This is your workspace's visible name.">
        <Skeleton className="h-9 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title="Name"
        description="This is your workspace's visible name."
        footerHint="Max 100 characters"
        footer={
          <Button type="submit" disabled={updateWorkspace.isPending}>
            {updateWorkspace.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            Save
          </Button>
        }
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                aria-label="Workspace name"
                disabled={updateWorkspace.isPending}
                id="name"
                type="text"
                placeholder="Acme Inc"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
