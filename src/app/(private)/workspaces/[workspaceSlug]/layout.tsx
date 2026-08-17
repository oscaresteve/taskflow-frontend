import { redirect } from "next/navigation";
import AppHeader from "@/components/app-header";
import { WorkspacesSidebar } from "@/components/workspaces-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { hasWorkspaces } from "@/lib/api/workspaces.server";

export default async function WorkspaceLayout({ children }: LayoutProps<"/workspaces/[workspaceSlug]">) {
  if (!(await hasWorkspaces())) {
    redirect("/onboarding");
  }

  return (
    <main className="[--header-height:calc(--spacing(12))]">
      <SidebarProvider className="flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <WorkspacesSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </main>
  );
}
