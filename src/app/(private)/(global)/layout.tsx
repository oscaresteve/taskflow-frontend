import { redirect } from "next/navigation";
import AppHeader from "@/components/app-header";
import { GlobalSidebar } from "@/components/global-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { hasWorkspaces } from "@/lib/api/workspaces.server";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasWorkspaces())) {
    redirect("/onboarding");
  }

  return (
    <main className="[--header-height:calc(--spacing(12))]">
      <SidebarProvider className="flex flex-col">
        <AppHeader />
        <div className="flex flex-1">
          <GlobalSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </main>
  );
}
