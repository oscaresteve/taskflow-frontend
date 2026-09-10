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
import { useTranslations } from "next-intl";

export function ProjectColorSection() {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
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
      toast.add({ type: "success", description: t("projectColorSection.updated") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("projectColorSection.failedToLoad")}</p>;
  }

  if (isLoading || !project) {
    return (
      <SettingCard
        title={t("projectColorSection.title")}
        description={t("projectColorSection.description")}
        action={<Skeleton className="size-16 rounded-full" />}
      />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title={t("projectColorSection.title")}
        description={t("projectColorSection.description")}
        footerHint={t("projectColorSection.footerHint")}
        footerAction={
          <Button type="submit" disabled={updateProject.isPending || !form.formState.isDirty}>
            {updateProject.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {tCommon("actions.save")}
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
