"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingCard } from "@/components/common/setting-card";
import { toast } from "@/components/ui/toast";
import { ColorPicker } from "@/components/common/color-picker";
import { useUpdateProject } from "@/hooks/use-update-project";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { UpdateProjectColorDto, updateProjectColorSchema } from "@/lib/schemas/project.schema";
import { Loader2Icon } from "lucide-react";

export function ProjectColorSection() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const updateProject = useUpdateProject(workspaceSlug, projectSlug);

  const form = useForm<UpdateProjectColorDto>({
    resolver: zodResolver(updateProjectColorSchema),
    defaultValues: { color: null },
  });

  useEffect(() => {
    if (project) {
      form.reset({ color: project.color });
    }
  }, [project, form]);

  async function onSubmit(data: UpdateProjectColorDto) {
    try {
      await updateProject.mutateAsync(data);
      toast.add({ type: "success", description: "Project color updated." });
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
      <SettingCard
        title="Color"
        description="Used to tell this project apart at a glance."
        action={<Skeleton className="size-16 rounded-full" />}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title="Color"
        description="Used to tell this project apart at a glance."
        footerHint="Choose no color to leave it unset."
        footerAction={
          <Button type="submit" disabled={updateProject.isPending}>
            {updateProject.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            Save
          </Button>
        }
        orientation="horizontal"
      >
        <Controller
          name="color"
          control={form.control}
          render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />}
        />
      </SettingCard>
    </form>
  );
}
