"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CreateWorkspaceDto, createWorkspaceSchema } from "@/lib/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { underlineFieldLabelClassName, underlineInputClassName } from "./onboarding-styles";

interface OnboardingWorkspaceFormProps {
  name: string;
  onCreated: (workspace: WorkspaceResponseDto) => void;
}

export function OnboardingWorkspaceForm({ name, onCreated }: OnboardingWorkspaceFormProps) {
  const t = useTranslations("onboarding");
  const createWorkspace = useCreateWorkspace();

  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: t("onboardingWorkspaceForm.defaultName", { name }),
      description: t("onboardingWorkspaceForm.defaultDescription", { name }),
    },
  });

  async function onSubmit(data: CreateWorkspaceDto) {
    try {
      const workspace = await createWorkspace.mutateAsync(data);
      onCreated(workspace);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("onboardingWorkspaceForm.genericError"),
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
              <FieldLabel htmlFor="name" className={underlineFieldLabelClassName}>
                {t("onboardingWorkspaceForm.nameLabel")}
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="name"
                type="text"
                placeholder={t("onboardingWorkspaceForm.namePlaceholder")}
                required
                autoFocus
                className={`h-12 text-2xl ${underlineInputClassName}`}
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
              <FieldLabel htmlFor="description" className={underlineFieldLabelClassName}>
                {t("onboardingWorkspaceForm.descriptionLabel")}
              </FieldLabel>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                id="description"
                placeholder={t("onboardingWorkspaceForm.descriptionPlaceholder")}
                className={`min-h-10 ${underlineInputClassName}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="mt-4">
          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {t("onboardingWorkspaceForm.submitButton")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
