import { hasWorkspaces } from "@/lib/api/workspaces.server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./_components/onboarding-flow";
import { OnboardingLogoutButton } from "./_components/onboarding-logout-button";
import TaskflowLogo from "@/components/layout/taskflow-logo";
import { getCurrentUser } from "@/lib/api/auth.server";

export default async function OnboardingPage() {
  if (await hasWorkspaces()) {
    redirect("/my-space");
  }
  const me = await getCurrentUser();

  return (
    <main className="relative h-dvh w-full items-center flex justify-center">
      <OnboardingLogoutButton />
      <div className="flex flex-col items-center gap-10">
        {me && (
          <>
            <TaskflowLogo />
            <OnboardingFlow name={me.firstName} />
          </>
        )}
      </div>
    </main>
  );
}
