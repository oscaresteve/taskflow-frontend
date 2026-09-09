"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/common/form-dialog";
import { ColorPicker } from "@/components/common/color-picker";
import { useCreateProject } from "@/hooks/use-create-project";
import { ApiError } from "@/lib/http/api-error";
import { CreateProjectDto, createProjectSchema } from "@/lib/schemas/project.schema";

interface CreateProjectDialogProps {
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ workspaceSlug, open, onOpenChange }: CreateProjectDialogProps) {
  const router = useRouter();
  const t = useTranslations("projects");
  const createProject = useCreateProject(workspaceSlug);

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      color: undefined,
    },
  });

  const key = useWatch({ control: form.control, name: "key" });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(data: CreateProjectDto) {
    try {
      const project = await createProject.mutateAsync(data);
      onOpenChange(false);
      router.push(`/workspaces/${workspaceSlug}/projects/${project.slug}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("createProjectDialog.title")}
      description={t("createProjectDialog.description")}
      formId="create-project-form"
      submitLabel={t("createProjectDialog.submit")}
      pending={createProject.isPending}
      media={<Badge variant="secondary">{key.trim() || t("createProjectDialog.keyDefault")}</Badge>}
    >
      <form id="create-project-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="project-name">{t("createProjectDialog.nameLabel")}</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="project-name"
                  type="text"
                  placeholder={t("createProjectDialog.namePlaceholder")}
                  required
                  autoFocus
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
                <FieldLabel htmlFor="project-key">{t("createProjectDialog.keyLabel")}</FieldLabel>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  aria-invalid={fieldState.invalid}
                  id="project-key"
                  type="text"
                  placeholder={t("createProjectDialog.keyPlaceholder")}
                  required
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
                <FieldLabel htmlFor="project-description">{t("createProjectDialog.descriptionLabel")}</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="project-description"
                  placeholder={t("createProjectDialog.descriptionPlaceholder")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="color"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldLabel>{t("createProjectDialog.colorLabel")}</FieldLabel>
                <ColorPicker value={field.value ?? null} onChange={(value) => field.onChange(value ?? undefined)} />
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
