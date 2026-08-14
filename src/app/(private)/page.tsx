import { redirect } from "next/navigation";
import { hasWorkspaces } from "@/lib/api/workspaces.server";

export default async function Resolver() {
  if (await hasWorkspaces()) {
    redirect("/home");
  }

  redirect("/onboarding");
}
