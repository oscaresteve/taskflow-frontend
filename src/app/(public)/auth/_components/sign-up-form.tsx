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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export function SignUpForm() {
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
      locale: "",
    },
  });

  async function onSubmit(data: SignUpDto) {
    try {
      await signUp({
        ...data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  return (
    <Card className="w-xs">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="firstName"
                    type="text"
                    placeholder="John"
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
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="lastName"
                    type="text"
                    placeholder="Doe"
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
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
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
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <PasswordInput {...field} aria-invalid={fieldState.invalid} id="confirmPassword" required />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Create Account</Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/auth/sign-in">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
