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
import { useUpdateProject } from "@/hooks/use-update-project";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { UpdateProjectNameDto, updateProjectNameSchema } from "@/lib/schemas/project.schema";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProjectNameSection() {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const updateProject = useUpdateProject(workspaceSlug, projectSlug);

  const form = useForm<UpdateProjectNameDto>({
    resolver: zodResolver(updateProjectNameSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (project) {
      form.reset({ name: project.name });
    }
  }, [project, form]);

  async function onSubmit(data: UpdateProjectNameDto) {
    try {
      const updatedProject = await updateProject.mutateAsync(data);
      toast.add({ type: "success", description: t("projectNameSection.updated") });
      if (updatedProject.slug !== projectSlug) {
        router.replace(`/workspaces/${workspaceSlug}/projects/${updatedProject.slug}/settings`);
      }
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("projectNameSection.failedToLoad")}</p>;
  }

  if (isLoading || !project) {
    return (
      <SettingCard title={t("projectNameSection.title")} description={t("projectNameSection.description")}>
        <Skeleton className="h-9 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title={t("projectNameSection.title")}
        description={t("projectNameSection.description")}
        footerHint={t("projectNameSection.footerHint")}
        footerAction={
          <Button type="submit" disabled={updateProject.isPending || !form.formState.isDirty}>
            {updateProject.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {tCommon("actions.save")}
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
                aria-label={t("projectNameSection.fieldLabel")}
                disabled={updateProject.isPending}
                id="name"
                type="text"
                placeholder={t("projectNameSection.placeholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
