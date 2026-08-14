import AppHeader from "@/components/app-header";
import { GlobalSidebar } from "@/components/global-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
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
