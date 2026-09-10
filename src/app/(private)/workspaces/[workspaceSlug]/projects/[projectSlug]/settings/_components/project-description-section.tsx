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
import { useUpdateProject } from "@/hooks/use-update-project";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { UpdateProjectDescriptionDto, updateProjectDescriptionSchema } from "@/lib/schemas/project.schema";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProjectDescriptionSection() {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const updateProject = useUpdateProject(workspaceSlug, projectSlug);

  const form = useForm<UpdateProjectDescriptionDto>({
    resolver: zodResolver(updateProjectDescriptionSchema),
    defaultValues: { description: "" },
  });

  useEffect(() => {
    if (project) {
      form.reset({ description: project.description ?? "" });
    }
  }, [project, form]);

  async function onSubmit(data: UpdateProjectDescriptionDto) {
    try {
      await updateProject.mutateAsync(data);
      toast.add({ type: "success", description: t("projectDescriptionSection.updated") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("projectDescriptionSection.failedToLoad")}</p>;
  }

  if (isLoading || !project) {
    return (
      <SettingCard title={t("projectDescriptionSection.title")} description={t("projectDescriptionSection.description")}>
        <Skeleton className="h-16 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title={t("projectDescriptionSection.title")}
        description={t("projectDescriptionSection.description")}
        footerHint={t("projectDescriptionSection.footerHint")}
        footerAction={
          <Button type="submit" disabled={updateProject.isPending || !form.formState.isDirty}>
            {updateProject.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {tCommon("actions.save")}
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
                aria-label={t("projectDescriptionSection.fieldLabel")}
                disabled={updateProject.isPending}
                id="description"
                placeholder={t("projectDescriptionSection.placeholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
