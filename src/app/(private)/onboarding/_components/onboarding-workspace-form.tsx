"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useCreateWorkspace } from "@/hooks/use-create-workspace";
import { CreateWorkspaceDto, createWorkspaceSchema } from "@/lib/schemas/workspace.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

const underlineInputClassName =
  "rounded-none border-0 border-b-2 border-input bg-transparent aria-invalid:ring-0 px-0 focus-visible:border-foreground focus-visible:ring-0";

export function OnboardingWorkspaceForm() {
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
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-10">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Name
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="name"
                type="text"
                placeholder="Acme Inc"
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
              <FieldLabel
                htmlFor="description"
                className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
              >
                Description
              </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                id="description"
                type="text"
                placeholder="Acme Inc's main workspace"
                className={`h-10 ${underlineInputClassName}`}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="mt-4">
          <Button type="submit" size="lg" className="w-full">
            Get started
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
