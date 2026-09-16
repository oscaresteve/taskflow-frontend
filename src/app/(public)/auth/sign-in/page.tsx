import { SignInForm } from "../_components/sign-in-form";
import { safeNextPath } from "@/lib/utils";

export default async function SignIn({ searchParams }: PageProps<"/auth/sign-in">) {
  const { next } = await searchParams;

  return (
    <main className="h-dvh w-full items-center flex justify-center">
      <SignInForm next={safeNextPath(next)} />
    </main>
  );
}
