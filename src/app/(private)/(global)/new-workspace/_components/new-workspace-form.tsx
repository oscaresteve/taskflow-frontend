"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { ApiError } from "@/lib/http/api-error";
import { CreateWorkspaceDto, createWorkspaceSchema } from "@/lib/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export function NewWorkspaceForm() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();

  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: CreateWorkspaceDto) {
    try {
      const workspace = await createWorkspace.mutateAsync(data);
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
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="name"
                type="text"
                placeholder="Acme Inc"
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
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="description"
                type="text"
                placeholder="Acme Inc's main workspace"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit">Create workspace</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
