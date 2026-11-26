import { AppShell } from "@/components/layout/app-shell";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireWorkspaces } from "@/lib/api/workspaces.server";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  await requireWorkspaces();

  return <AppShell sidebar={<AppSidebar />}>{children}</AppShell>;
}
