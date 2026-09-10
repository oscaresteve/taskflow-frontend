"use client";

import { useState } from "react";
import { Archive, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
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

interface TaskActionsMenuProps {
  task: TaskResponseDto;
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  onArchived: () => void;
}

export function TaskActionsMenu({ task, workspaceSlug, projectSlug, taskNumber, onArchived }: TaskActionsMenuProps) {
  const t = useTranslations("tasks");
  const archiveTask = useArchiveTask(workspaceSlug, projectSlug, taskNumber);
  const [archiveOpen, setArchiveOpen] = useState(false);

  async function handleArchive() {
    try {
      await archiveTask.mutateAsync();
      setArchiveOpen(false);
      onArchived();
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
        <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" />}>
          <MoreHorizontal />
          <span className="sr-only">{t("taskActionsMenu.ariaLabel")}</span>
        </DropdownMenuTrigger>
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
        title={t("taskActionsMenu.confirmTitle", { taskTitle: task.title })}
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
