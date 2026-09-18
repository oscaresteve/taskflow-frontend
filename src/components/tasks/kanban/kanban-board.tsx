"use client";

import { useQuery } from "@tanstack/react-query";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { getTasksBoardQuery } from "@/lib/queries/task.queries";
import { useKanbanDrag } from "@/hooks/use-kanban-drag";
import { useKanbanFilters } from "@/hooks/use-kanban-filters";
import { filterBoardTasks } from "@/lib/kanban";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import { KanbanFilterBar } from "./kanban-filter-bar";
import { useTranslations } from "next-intl";

interface KanbanBoardProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
}

export function KanbanBoard({ workspaceSlug, project }: KanbanBoardProps) {
  const { data: tasks, isLoading, isError } = useQuery(getTasksBoardQuery(workspaceSlug, project.slug));

  const {
    search,
    assigneeId,
    priority,
    dueDate,
    debouncedSearch,
    onSearchChange,
    onAssigneeChange,
    onPriorityChange,
    onDueDateChange,
  } = useKanbanFilters();

  const filteredTasks = tasks
    ? filterBoardTasks(tasks, { search: debouncedSearch, assigneeId, priority, dueDate })
    : tasks;

  const { activeTask, columns, dropStatus, sensors, collisionDetection, handlers } = useKanbanDrag({
    workspaceSlug,
    projectSlug: project.slug,
    tasks: filteredTasks,
  });

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
    <div className="flex flex-col gap-4">
      <KanbanFilterBar
        workspaceSlug={workspaceSlug}
        projectSlug={project.slug}
        search={search}
        onSearchChange={onSearchChange}
        assigneeId={assigneeId}
        onAssigneeChange={onAssigneeChange}
        priority={priority}
        onPriorityChange={onPriorityChange}
        dueDate={dueDate}
        onDueDateChange={onDueDateChange}
      />

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
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <KanbanCard
              taskKey={`${project.key}-${activeTask.taskNumber}`}
              task={activeTask}
              workspaceSlug={workspaceSlug}
              projectSlug={project.slug}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
