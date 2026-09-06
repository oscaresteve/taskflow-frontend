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

  if (isError) {
    return <p className="py-4 text-sm text-muted-foreground">Failed to load tasks.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex gap-3">
        {taskStatuses.map((status) => (
          <Skeleton key={status} className="h-64 w-72 shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} {...handlers}>
      <div className="flex gap-3 overflow-x-auto pb-2">
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
