"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { getTasksBoardQuery } from "@/lib/queries/task.queries";
import { useKanbanDrag } from "@/hooks/use-kanban-drag";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import { useTranslations } from "next-intl";

interface KanbanBoardProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  members: ProjectMemberWithUserResponseDto[];
}

export function KanbanBoard({ workspaceSlug, project, members }: KanbanBoardProps) {
  const { data: tasks, isLoading, isError } = useQuery(getTasksBoardQuery(workspaceSlug, project.slug));

  const { activeTask, columns, dropStatus, sensors, collisionDetection, handlers } = useKanbanDrag({
    workspaceSlug,
    projectSlug: project.slug,
    tasks,
  });

  const assigneesById = useMemo(() => new Map(members.map((member) => [member.userId, member.user])), [members]);
  const t = useTranslations("tasks");

  if (isError) {
    return <p className="py-4 text-sm text-muted-foreground">{t("kanbanBoard.failedToLoad")}</p>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {taskStatuses.map((status) => (
          <Skeleton key={status} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} {...handlers}>
      <div className="grid grid-cols-4 gap-3">
        {taskStatuses.map((status) => (
          <KanbanColumn
            key={status}
            workspaceSlug={workspaceSlug}
            projectSlug={project.slug}
            projectKey={project.key}
            status={status}
            tasks={columns[status]}
            isDropTarget={dropStatus === status}
            assigneesById={assigneesById}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <KanbanCard
            taskKey={`${project.key}-${activeTask.taskNumber}`}
            task={activeTask}
            assignee={activeTask.assigneeId ? assigneesById.get(activeTask.assigneeId) : undefined}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
