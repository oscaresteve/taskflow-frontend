"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { ICONS } from "@/lib/icons";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent, ActionsMenuItem } from "@/components/common/actions-menu";
import { toast } from "@/components/ui/toast";
import { useArchiveTask } from "@/hooks/use-archive-task";
import { useUnarchiveTask } from "@/hooks/use-unarchive-task";
import { ApiError } from "@/lib/http/api-error";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { useToggleTaskFavorite } from "@/hooks/use-toggle-task-favorite";
import { RowActionButton } from "@/components/common/row-action-button";
import { cn } from "@/lib/utils";

// Prop derivada directamente con ComponentProps.
// Asi nos aseguramos que se le pasa exactamente lo que el componente pide
type TriggerRenderProp = ComponentProps<typeof DropdownMenuTrigger>["render"];

interface TaskActionsMenuProps extends Pick<ComponentProps<typeof Button>, "size" | "variant"> {
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
  size = "icon-sm",
  variant = "outline"
}: TaskActionsMenuProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const archiveTask = useArchiveTask(workspaceSlug, projectSlug, taskNumber);
  const unarchiveTask = useUnarchiveTask(workspaceSlug, projectSlug, taskNumber);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [unarchiveOpen, setUnarchiveOpen] = useState(false);
  const toggleFavorite = useToggleTaskFavorite(workspaceSlug, projectSlug, taskNumber);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : t("errors.generic"),
      priority: "high",
    });
  }

  async function handleArchive() {
    try {
      await archiveTask.mutateAsync();
      setArchiveOpen(false);
      toast.add({ type: "success", description: t("taskActionsMenu.archiveSuccess") });
      onArchived?.();
    } catch (error) {
      reportError(error);
    }
  }

  async function handleUnarchive() {
    try {
      await unarchiveTask.mutateAsync();
      setUnarchiveOpen(false);
      toast.add({ type: "success", description: t("taskActionsMenu.unarchiveSuccess") });
    } catch (error) {
      reportError(error);
    }
  }

  // Una tarea archivada sigue siendo direccionable, pero lo unico que se puede hacer con ella es
  // desarchivarla: esa salida se pinta directamente, sin menu de un solo elemento.
  if (task.isArchived) {
    return (
      <>
        <RowActionButton onClick={() => setUnarchiveOpen(true)}>
          <ICONS.unarchive />
          {t("taskActionsMenu.unarchive")}
        </RowActionButton>
        <ConfirmDialog
          open={unarchiveOpen}
          onOpenChange={setUnarchiveOpen}
          title={t.rich("taskActionsMenu.unarchiveConfirmTitle", { taskTitle: task.title, ...richTitleTags })}
          description={t("taskActionsMenu.unarchiveConfirmDescription")}
          confirmLabel={t("taskActionsMenu.unarchive")}
          onConfirm={handleUnarchive}
          pending={unarchiveTask.isPending}
          Icon={ICONS.unarchive}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  triggerRender ?? (
                    <Button aria-label={t("taskActionsMenu.ariaLabel")} variant={variant} size={size} />
                  )
                }
              />
            }
          >
            <ICONS.moreActions />
          </TooltipTrigger>
          <TooltipContent>{t("taskActionsMenu.ariaLabel")}</TooltipContent>

          <ActionsMenuContent align="end">
            <ActionsMenuItem onClick={() => toggleFavorite.mutate(!task.isFavorite)}>
              <ICONS.favorite className={cn(task.isFavorite && "fill-current")} />
              {task.isFavorite ? tCommon("actions.removeFromFavorites") : tCommon("actions.addToFavorites")}
            </ActionsMenuItem>
            <DropdownMenuSeparator />
            <ActionsMenuItem variant="destructive" onClick={() => setArchiveOpen(true)}>
              <ICONS.archive />
              {t("taskActionsMenu.archive")}
            </ActionsMenuItem>
          </ActionsMenuContent>
        </DropdownMenu>
      </Tooltip>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t.rich("taskActionsMenu.confirmTitle", { taskTitle: task.title, ...richTitleTags })}
        description={t("taskActionsMenu.confirmDescription")}
        confirmLabel={t("taskActionsMenu.archive")}
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveTask.isPending}
        Icon={ICONS.archive}
      />
    </>
  );
}
