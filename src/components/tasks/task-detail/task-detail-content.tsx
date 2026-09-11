"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { TaskActionsMenu } from "./task-actions-menu";
import { TaskBreadcrumb } from "./task-breadcrumb";
import { TaskDetailHeader } from "./task-detail-header";
import { TaskNameSection } from "./task-name-section";
import { TaskDescriptionSection } from "./task-description-section";
import { TaskStatusSection } from "./task-status-section";
import { TaskPrioritySection } from "./task-priority-section";
import { TaskAssigneeSection } from "./task-assignee-section";
import { TaskDueDateSection } from "./task-due-date-section";
import { CommentsSection } from "@/components/tasks/comments/comments-section";
import { Separator } from "@/components/ui/separator";

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
  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug));
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const { data: members } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">{t("taskPage.failedToLoadTask")}</p>
      </div>
    );
  }

  if (isLoading || !task) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col">
      <TaskDetailHeader
        className="p-4"
        breadcrumb={
          <TaskBreadcrumb
            workspaceName={workspace?.name ?? workspaceSlug}
            workspaceSlug={workspaceSlug}
            projectName={project?.name ?? projectSlug}
            projectSlug={projectSlug}
            taskLabel={`${project?.key ?? projectSlug}-${task.taskNumber}`}
          />
        }
        isArchived={task.isArchived}
        archivedLabel={t("taskPage.archived")}
        closeLabel={tCommon("actions.close")}
        actions={
          <TaskActionsMenu
            task={task}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            onArchived={onClosePanel}
          />
        }
      />

      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <ResizablePanel defaultSize="70%" minSize="50%" className="flex flex-col gap-4 p-4">
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
          <Separator />
          <CommentsSection
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            members={members ?? []}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="30%" minSize="30%" className="flex flex-col gap-4 p-4">
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
