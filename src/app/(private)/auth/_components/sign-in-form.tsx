"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInDto, signInSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

export function SignInForm() {
  const form = useForm<SignInDto>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: SignInDto) {
    console.log(data);
  }

  return (
    <Card className="w-xs">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
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
                  <Input {...field} aria-invalid={fieldState.invalid} id="password" type="password" required />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">Sign In</Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link href="/auth/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
