import { redirect } from "next/navigation";
import { getWorkspacesServer } from "@/lib/api/workspaces.server";

export default async function Resolver() {
  const workspaces = await getWorkspacesServer();

  if (!workspaces || workspaces.data.length === 0) {
    redirect("/onboarding");
  }

  redirect(`/home`);
}
