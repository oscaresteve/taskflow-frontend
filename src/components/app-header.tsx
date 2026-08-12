import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Workflow } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <SidebarTrigger className="mx-3" />
      <Separator orientation="vertical" className="h-8 my-auto" />
      <div className="flex gap-2 items-center mx-4">
        <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Workflow className="size-3.5" />
        </div>
        <span className="font-semibold text-lg">TaskFlow</span>
      </div>
    </header>
  );
}
