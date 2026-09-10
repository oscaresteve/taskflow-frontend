"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskDetailContent } from "./task-detail-content";

// Montado una sola vez en la raiz (como <Toaster />): funciona igual sin importar desde que
// pagina se abrio la tarea.
export function TaskDetailModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const workspaceSlug = searchParams.get("taskWorkspace");
  const projectSlug = searchParams.get("taskProject");
  const taskNumber = searchParams.get("taskNumber");

  if (!workspaceSlug || !projectSlug || !taskNumber) {
    return null;
  }

  function handleClose() {
    const params = new URLSearchParams(searchParams);
    params.delete("taskWorkspace");
    params.delete("taskProject");
    params.delete("taskNumber");
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-5xl max-h-[85vh] overflow-y-auto p-6">
        <TaskDetailContent
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          taskNumber={taskNumber}
          onClosePanel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
