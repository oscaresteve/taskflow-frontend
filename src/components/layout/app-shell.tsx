import AppHeader from "@/components/layout/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <SidebarProvider className="[--header-height:calc(--spacing(12))]">
      <AppHeader />
      {sidebar}
      <SidebarInset className="mt-(--header-height) h-[calc(100svh-var(--header-height))] overflow-y-auto">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
