import { Workflow } from "lucide-react";

export default function TaskflowLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Workflow className="size-4" />
      </div>
      <span className="text-base font-semibold">TaskFlow</span>
    </div>
  );
}
