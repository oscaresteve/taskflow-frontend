import { Suspense } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { ColorSchemeToggle } from "@/components/common/color-scheme-toggle";
import { CommandPalette } from "@/components/search/command-palette";

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <SidebarTrigger className="mx-3" />
      <Separator orientation="vertical" className="h-8 my-auto" />
      <BreadcrumbNav />
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
        {/* La paleta lee useSearchParams para construir el enlace de una tarea; sin este limite de
            Suspense el build falla, igual que pasa con <TaskDetailModal /> en la raiz. */}
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      </div>
      <div className="flex items-center gap-2 ml-auto mx-3">
        <ColorSchemeToggle />
      </div>
    </header>
  );
}
