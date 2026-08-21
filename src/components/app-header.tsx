import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <SidebarTrigger className="mx-3" />
      <Separator orientation="vertical" className="h-8 my-auto" />
      <BreadcrumbNav />
    </header>
  );
}
