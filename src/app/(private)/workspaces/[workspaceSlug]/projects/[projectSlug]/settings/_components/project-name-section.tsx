"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingCard } from "@/components/common/setting-card";
import { toast } from "@/components/ui/toast";
import { useUpdateProject } from "@/hooks/use-update-project";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { Loader2Icon } from "lucide-react";

const projectNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),
});

type ProjectNameFormValues = z.infer<typeof projectNameSchema>;

export function ProjectNameSection() {
  const router = useRouter();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const updateProject = useUpdateProject(workspaceSlug, projectSlug);

  const form = useForm<ProjectNameFormValues>({
    resolver: zodResolver(projectNameSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (project) {
      form.reset({ name: project.name });
    }
  }, [project, form]);

  async function onSubmit(data: ProjectNameFormValues) {
    try {
      const updatedProject = await updateProject.mutateAsync(data);
      toast.add({ type: "success", description: "Project name updated." });
      if (updatedProject.slug !== projectSlug) {
        router.replace(`/workspaces/${workspaceSlug}/projects/${updatedProject.slug}/settings`);
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
    return <p className="text-sm text-muted-foreground">Failed to load project.</p>;
  }

  if (isLoading || !project) {
    return (
      <SettingCard title="Name" description="This is your project's visible name.">
        <Skeleton className="h-9 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title="Name"
        description="This is your project's visible name."
        footerHint="Max 100 characters"
        footer={
          <Button type="submit" disabled={updateProject.isPending}>
            {updateProject.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
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
                aria-label="Project name"
                disabled={updateProject.isPending}
                id="name"
                type="text"
                placeholder="Website Redesign"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
