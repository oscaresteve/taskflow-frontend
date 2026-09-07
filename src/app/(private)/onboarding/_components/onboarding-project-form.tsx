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
import { Controller, useForm } from "react-hook-form";
import { underlineFieldLabelClassName, underlineInputClassName } from "./onboarding-styles";

interface OnboardingProjectFormProps {
  workspaceSlug: string;
  workspaceName: string;
  onCreated: (project: ProjectResponseDto) => void;
  onSkip: () => void;
}

export function OnboardingProjectForm({ workspaceSlug, workspaceName, onCreated, onSkip }: OnboardingProjectFormProps) {
  const createProject = useCreateProject(workspaceSlug);

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: `${workspaceName}'s first project`,
      key: "MAIN",
      description: `Where ${workspaceName}'s first tasks live.`,
    },
  });

  async function onSubmit(data: CreateProjectDto) {
    try {
      const project = await createProject.mutateAsync(data);
      onCreated(project);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
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
                Name
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="project-name"
                type="text"
                placeholder="Website Redesign"
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
                Key
              </FieldLabel>
              <Input
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                aria-invalid={fieldState.invalid}
                id="project-key"
                type="text"
                placeholder="WEB"
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
                Description
              </FieldLabel>
              <Textarea
                {...field}
                aria-invalid={fieldState.invalid}
                id="project-description"
                placeholder="Redesign of the marketing site"
                className={`min-h-10 ${underlineInputClassName}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="mt-4 gap-2">
          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            Create project
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onSkip}>
            Skip for now
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
