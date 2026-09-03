"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/form-dialog";
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
  const createProject = useCreateProject(workspaceSlug);

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
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
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create project"
      description="Set up a new project to organize tasks."
      formId="create-project-form"
      submitLabel="Create project"
      pending={createProject.isPending}
      media={<Badge variant="secondary">{key.trim() || "KEY"}</Badge>}
    >
      <form id="create-project-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="project-name">Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="project-name"
                  type="text"
                  placeholder="Website Redesign"
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
                <FieldLabel htmlFor="project-key">Key</FieldLabel>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  aria-invalid={fieldState.invalid}
                  id="project-key"
                  type="text"
                  placeholder="WEB"
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
                <FieldLabel htmlFor="project-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="project-description"
                  placeholder="Redesign of the marketing site"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
