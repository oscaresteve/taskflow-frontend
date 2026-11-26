import { cookies } from "next/headers";
import AppHeader from "@/components/layout/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Same cookie the sidebar itself writes to on toggle (src/components/ui/sidebar.tsx).
// Read here, server-side, so both the global and the workspace shell restore the same
// expanded/collapsed state on load instead of always defaulting to expanded.
const SIDEBAR_COOKIE_NAME = "sidebar_state";

export async function AppShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value;

  return (
    <SidebarProvider
      className="[--header-height:calc(--spacing(12))]"
      defaultOpen={sidebarState !== "false"}
    >
      <AppHeader />
      {sidebar}
      <SidebarInset className="mt-(--header-height) h-[calc(100svh-var(--header-height))] overflow-y-auto">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
