import AppHeader from "@/components/app-header";
import { WorkspacesSidebar } from "@/components/workspaces-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function WorkspaceLayout({ children }: LayoutProps<"/workspaces/[workspaceSlug]">) {
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
