"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/password-input";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/http/api-error";
import { SignInDto, signInSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";

export function SignInForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const form = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInDto) {
    try {
      await signIn(data);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("signInForm.genericError"),
        priority: "high",
      });
    }
  }

  return (
    <Card className="w-xs">
      <CardHeader>
        <CardTitle>{t("signInForm.title")}</CardTitle>
        <CardDescription>{t("signInForm.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">{t("signInForm.emailLabel")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("signInForm.emailPlaceholder")}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">{t("signInForm.passwordLabel")}</FieldLabel>
                  <PasswordInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="password"
                    autoComplete="current-password"
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" aria-hidden="true" />}
                {t("signInForm.submitButton")}
              </Button>
              <FieldDescription className="text-center">
                {t("signInForm.signUpPrompt")} <Link href="/auth/sign-up">{t("signInForm.signUpLink")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
