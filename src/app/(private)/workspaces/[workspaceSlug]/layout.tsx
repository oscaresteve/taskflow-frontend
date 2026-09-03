import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { WorkspacesSidebar } from "@/components/layout/workspaces-sidebar";
import { getWorkspaceServer, requireWorkspaces } from "@/lib/api/workspaces.server";

// Routing rule: anything scoped to a single workspace (projects, settings, members, tasks)
// nests under /workspaces/[workspaceSlug]/...; cross-workspace pages live under (global).
export default async function WorkspaceLayout({ children, params }: LayoutProps<"/workspaces/[workspaceSlug]">) {
  await requireWorkspaces();

  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceServer(workspaceSlug);
  if (!workspace) {
    notFound();
  }

  return <AppShell sidebar={<WorkspacesSidebar />}>{children}</AppShell>;
}
