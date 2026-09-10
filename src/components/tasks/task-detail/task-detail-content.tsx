"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { TaskActionsMenu } from "./task-actions-menu";
import { TaskNameSection } from "./task-name-section";
import { TaskDescriptionSection } from "./task-description-section";
import { TaskStatusSection } from "./task-status-section";
import { TaskPrioritySection } from "./task-priority-section";
import { TaskAssigneeSection } from "./task-assignee-section";
import { TaskDueDateSection } from "./task-due-date-section";
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
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex flex-col gap-2">
        <TaskNameSection
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          taskNumber={taskNumber}
          title={task.title}
        />
        <TaskDescriptionSection
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          taskNumber={taskNumber}
          description={task.description}
        />
      </div>

      <FieldGroup>
        <div className="flex flex-wrap gap-3">
          <TaskStatusSection
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            status={task.status}
          />
          <TaskPrioritySection
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            priority={task.priority}
          />
          <TaskAssigneeSection
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            assigneeId={task.assigneeId}
          />
          <TaskDueDateSection
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            dueDate={task.dueDate}
          />
        </div>
      </FieldGroup>

      <CommentsSection
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        taskNumber={taskNumber}
        members={members ?? []}
      />
    </div>
  );
}
