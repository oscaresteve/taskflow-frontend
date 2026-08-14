import { hasWorkspaces } from "@/lib/api/workspaces.server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  if (await hasWorkspaces()) {
    redirect("/home");
  }

  return <div>Onboarding</div>;
}
