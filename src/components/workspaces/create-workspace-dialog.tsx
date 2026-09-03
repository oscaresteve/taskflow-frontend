"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/common/form-dialog";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { ApiError } from "@/lib/http/api-error";
import { CreateWorkspaceDto, createWorkspaceSchema } from "@/lib/schemas/workspace.schema";
import { getInitials } from "@/lib/utils";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();

  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const name = useWatch({ control: form.control, name: "name" });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(data: CreateWorkspaceDto) {
    try {
      const workspace = await createWorkspace.mutateAsync(data);
      onOpenChange(false);
      router.push(`/workspaces/${workspace.slug}`);
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
      title="Create workspace"
      description="Set up a new workspace to organize projects and tasks."
      formId="create-workspace-form"
      submitLabel="Create workspace"
      pending={createWorkspace.isPending}
      media={
        <Avatar size="lg">
          {name.trim() ? (
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          ) : (
            <AvatarFallback>
              <Building2 />
            </AvatarFallback>
          )}
        </Avatar>
      }
    >
      <form id="create-workspace-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="workspace-name"
                  type="text"
                  placeholder="Acme Inc"
                  required
                  autoFocus
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
                <FieldLabel htmlFor="workspace-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="workspace-description"
                  placeholder="Acme Inc's main workspace"
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
