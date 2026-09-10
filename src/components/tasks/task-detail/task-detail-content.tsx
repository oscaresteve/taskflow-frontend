"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { EditTaskForm } from "./edit-task-form";
import { TaskActionsMenu } from "./task-actions-menu";
import { CommentsSection } from "@/components/tasks/comments/comments-section";

interface TaskDetailContentProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  onClosePanel: () => void;
}

export function TaskDetailContent({ workspaceSlug, projectSlug, taskNumber, onClosePanel }: TaskDetailContentProps) {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const { data: task, isLoading, isError } = useQuery(getTaskQuery({ workspaceSlug, projectSlug, taskNumber }));
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const { data: members } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("taskPage.failedToLoadTask")}</p>;
  }

  if (isLoading || !task) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {project?.key}-{task.taskNumber}
          </span>
          {task.isArchived ? <Badge variant="outline">{t("taskPage.archived")}</Badge> : null}
        </div>
        <div className="flex items-center gap-1">
          <TaskActionsMenu
            task={task}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            onArchived={onClosePanel}
          />
          <DialogClose render={<Button variant="outline" size="icon-sm" />}>
            <XIcon />
            <span className="sr-only">{tCommon("actions.close")}</span>
          </DialogClose>
        </div>
      </div>

      <EditTaskForm workspaceSlug={workspaceSlug} projectSlug={projectSlug} taskNumber={taskNumber} />

      <CommentsSection
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        taskNumber={taskNumber}
        members={members ?? []}
      />
    </div>
  );
}
