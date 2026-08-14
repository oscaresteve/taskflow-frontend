import { hasWorkspaces } from "@/lib/api/workspaces.server";
import { redirect } from "next/navigation";
import { OnboardingWorkspaceForm } from "./_components/onboarding-workspace-form";

export default async function OnboardingPage() {
  if (await hasWorkspaces()) {
    redirect("/home");
  }

  return (
    <main className="h-dvh w-full items-center flex justify-center">
      <OnboardingWorkspaceForm />
    </main>
  );
}
