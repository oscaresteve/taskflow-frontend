import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { ColorSchemeToggle } from "@/components/common/color-scheme-toggle";

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <SidebarTrigger className="mx-3" />
      <Separator orientation="vertical" className="h-8 my-auto" />
      <BreadcrumbNav />
      <div className="flex ml-auto mx-3">
        <ColorSchemeToggle />
      </div>
    </header>
  );
}
