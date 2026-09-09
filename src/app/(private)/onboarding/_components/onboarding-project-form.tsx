"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useCreateProject } from "@/hooks/use-create-project";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { CreateProjectDto, createProjectSchema } from "@/lib/schemas/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { underlineFieldLabelClassName, underlineInputClassName } from "./onboarding-styles";

interface OnboardingProjectFormProps {
  workspaceSlug: string;
  workspaceName: string;
  onCreated: (project: ProjectResponseDto) => void;
  onSkip: () => void;
}

export function OnboardingProjectForm({ workspaceSlug, workspaceName, onCreated, onSkip }: OnboardingProjectFormProps) {
  const t = useTranslations("onboarding");
  const createProject = useCreateProject(workspaceSlug);

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: t("onboardingProjectForm.defaultName", { workspaceName }),
      key: "MAIN",
      description: t("onboardingProjectForm.defaultDescription", { workspaceName }),
    },
  });

  async function onSubmit(data: CreateProjectDto) {
    try {
      const project = await createProject.mutateAsync(data);
      onCreated(project);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("onboardingProjectForm.genericError"),
        priority: "high",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-10">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-name" className={underlineFieldLabelClassName}>
                {t("onboardingProjectForm.nameLabel")}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="project-name"
                type="text"
                placeholder={t("onboardingProjectForm.namePlaceholder")}
                required
                autoFocus
                className={`h-12 text-2xl ${underlineInputClassName}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="key"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-key" className={underlineFieldLabelClassName}>
                {t("onboardingProjectForm.keyLabel")}
              </FieldLabel>
              <Input
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                aria-invalid={fieldState.invalid}
                id="project-key"
                type="text"
                placeholder={t("onboardingProjectForm.keyPlaceholder")}
                required
                className={underlineInputClassName}
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
              <FieldLabel htmlFor="project-description" className={underlineFieldLabelClassName}>
                {t("onboardingProjectForm.descriptionLabel")}
              </FieldLabel>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                id="project-description"
                placeholder={t("onboardingProjectForm.descriptionPlaceholder")}
                className={`min-h-10 ${underlineInputClassName}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="mt-4 gap-2">
          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {t("onboardingProjectForm.submitButton")}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onSkip}>
            {t("onboardingProjectForm.skipButton")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
