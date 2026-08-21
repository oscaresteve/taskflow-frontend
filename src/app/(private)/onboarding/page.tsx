import { hasWorkspaces } from "@/lib/api/workspaces.server";
import { redirect } from "next/navigation";
import { OnboardingWorkspaceForm } from "./_components/onboarding-workspace-form";
import { OnboardingLogoutButton } from "./_components/onboarding-logout-button";
import TaskflowLogo from "@/components/taskflow-logo";

export default async function OnboardingPage() {
  if (await hasWorkspaces()) {
    redirect("/home");
  }

  return (
    <main className="relative h-dvh w-full items-center flex justify-center">
      <OnboardingLogoutButton />
      <div className="flex flex-col items-center gap-10">
        <TaskflowLogo />
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-balance">Let&apos;s set up your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">This is where your projects and tasks will live.</p>
          <OnboardingWorkspaceForm />
        </div>
      </div>
    </main>
  );
}
