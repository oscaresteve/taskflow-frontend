import { AppShell } from "@/components/layout/app-shell";
import { GlobalSidebar } from "@/components/layout/global-sidebar";
import { requireWorkspaces } from "@/lib/api/workspaces.server";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  await requireWorkspaces();

  return <AppShell sidebar={<GlobalSidebar />}>{children}</AppShell>;
}
