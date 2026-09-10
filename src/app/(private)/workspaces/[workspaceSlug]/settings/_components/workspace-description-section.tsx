"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { UpdateWorkspaceDescriptionDto, updateWorkspaceDescriptionSchema } from "@/lib/schemas/workspace.schema";
import { Loader2Icon } from "lucide-react";

export function WorkspaceDescriptionSection() {
  const t = useTranslations("workspaces");
  const commonT = useTranslations("common");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const updateWorkspace = useUpdateWorkspace(workspaceSlug);

  const form = useForm<UpdateWorkspaceDescriptionDto>({
    resolver: zodResolver(updateWorkspaceDescriptionSchema),
    defaultValues: { description: "" },
  });

  useEffect(() => {
    if (workspace) {
      form.reset({ description: workspace.description ?? "" });
    }
  }, [workspace, form]);

  async function onSubmit(data: UpdateWorkspaceDescriptionDto) {
    try {
      await updateWorkspace.mutateAsync(data);
      toast.add({ type: "success", description: t("workspaceDescriptionSection.successMessage") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("workspaceDescriptionSection.failedToLoad")}</p>;
  }

  if (isLoading || !workspace) {
    return (
      <SettingCard
        title={t("workspaceDescriptionSection.title")}
        description={t("workspaceDescriptionSection.description")}
      >
        <Skeleton className="h-16 w-full" />
      </SettingCard>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SettingCard
        title={t("workspaceDescriptionSection.title")}
        description={t("workspaceDescriptionSection.description")}
        footerHint={t("workspaceDescriptionSection.footerHint")}
        footerAction={
          <Button type="submit" disabled={updateWorkspace.isPending || !form.formState.isDirty}>
            {updateWorkspace.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
            {commonT("actions.save")}
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
                aria-label={t("workspaceDescriptionSection.descriptionLabel")}
                disabled={updateWorkspace.isPending}
                id="description"
                placeholder={t("workspaceDescriptionSection.descriptionPlaceholder")}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </SettingCard>
    </form>
  );
}
