import { Suspense } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { ColorSchemeToggle } from "@/components/common/color-scheme-toggle";
import { CommandPalette } from "@/components/search/command-palette";
import { NotificationBell } from "@/components/notifications/notification-bell";

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <SidebarTrigger className="mx-3" />
      <Separator orientation="vertical" className="h-8 my-auto" />
      {/* Las dos columnas laterales crecen por igual, asi la paleta queda centrada sin salirse del
          flujo. Centrarla en absoluto la dejaba por encima del breadcrumb, que no puede encogerse
          para hacerle sitio, y con nombres largos el texto pasaba por debajo del boton. */}
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <BreadcrumbNav />
      </div>
      {/* La paleta lee useSearchParams para construir el enlace de una tarea; sin este limite de
          Suspense el build falla, igual que pasa con <TaskDetailModal /> en la raiz. */}
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 mx-3">
        <NotificationBell />
        <ColorSchemeToggle />
      </div>
    </header>
  );
}
