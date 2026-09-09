"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/common/password-input";
import { toast } from "@/components/ui/toast";
import { signUp } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/http/api-error";
import { SignUpDto, signUpSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { normalizeLocale } from "@/lib/locale";

export function SignUpForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const form = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      timezone: "",
      locale: "en",
    },
  });

  async function onSubmit(data: SignUpDto) {
    try {
      await signUp({
        ...data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: normalizeLocale(navigator.language),
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("signUpForm.genericError"),
        priority: "high",
      });
    }
  }

  return (
    <Card className="w-xs">
      <CardHeader>
        <CardTitle>{t("signUpForm.title")}</CardTitle>
        <CardDescription>{t("signUpForm.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">{t("signUpForm.firstNameLabel")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder={t("signUpForm.firstNamePlaceholder")}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">{t("signUpForm.lastNameLabel")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder={t("signUpForm.lastNamePlaceholder")}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">{t("signUpForm.emailLabel")}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t("signUpForm.emailPlaceholder")}
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
                  <FieldLabel htmlFor="password">{t("signUpForm.passwordLabel")}</FieldLabel>
                  <PasswordInput
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (form.getFieldState("confirmPassword").isTouched) {
                        form.trigger("confirmPassword");
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                    id="password"
                    autoComplete="new-password"
                    required
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>{t("signUpForm.passwordHint")}</FieldDescription>
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">{t("signUpForm.confirmPasswordLabel")}</FieldLabel>
                  <PasswordInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="confirmPassword"
                    autoComplete="new-password"
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2Icon className="animate-spin" aria-hidden="true" />}
                {t("signUpForm.submitButton")}
              </Button>
              <FieldDescription className="text-center">
                {t("signUpForm.signInPrompt")} <Link href="/auth/sign-in">{t("signUpForm.signInLink")}</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
