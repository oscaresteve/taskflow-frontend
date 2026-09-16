"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Archive, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useArchiveTask } from "@/hooks/use-archive-task";
import { ApiError } from "@/lib/http/api-error";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";

// Prop derivada directamente con ComponentProps.
// Asi nos aseguramos que se le pasa exactamente lo que el componente pide
type TriggerRenderProp = ComponentProps<typeof DropdownMenuTrigger>["render"];

interface TaskActionsMenuProps {
  task: TaskResponseDto;
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  onArchived?: () => void;
  triggerRender?: TriggerRenderProp;
}

export function TaskActionsMenu({
  task,
  workspaceSlug,
  projectSlug,
  taskNumber,
  onArchived,
  triggerRender,
}: TaskActionsMenuProps) {
  const t = useTranslations("tasks");
  const archiveTask = useArchiveTask(workspaceSlug, projectSlug, taskNumber);
  const [archiveOpen, setArchiveOpen] = useState(false);

  async function handleArchive() {
    try {
      await archiveTask.mutateAsync();
      setArchiveOpen(false);
      toast.add({ type: "success", description: t("taskActionsMenu.archiveSuccess") });
      onArchived?.();
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (task.isArchived) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            triggerRender ?? (
              <Button variant="outline" size="icon-sm">
                <MoreHorizontal />
                <span className="sr-only">{t("taskActionsMenu.ariaLabel")}</span>
              </Button>
            )
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setArchiveOpen(true)}>
            <Archive />
            {t("taskActionsMenu.archive")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t.rich("taskActionsMenu.confirmTitle", { taskTitle: task.title, ...richTitleTags })}
        description={t("taskActionsMenu.confirmDescription")}
        confirmLabel={t("taskActionsMenu.archive")}
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveTask.isPending}
        Icon={Archive}
      />
    </>
  );
}
