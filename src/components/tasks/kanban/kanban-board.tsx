"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { useMoveTaskStatus } from "@/hooks/use-move-task-status";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";

interface KanbanBoardProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  members: ProjectMemberWithUserResponseDto[];
}

export function KanbanBoard({ workspaceSlug, project, members }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskResponseDto | null>(null);
  const moveTaskStatus = useMoveTaskStatus(workspaceSlug, project.slug);
  const assigneesById = new Map(members.map((member) => [member.userId, member.user]));

  // A pointer needs to travel a few pixels before this counts as a drag, so a plain click on a
  // card still navigates to its detail page instead of always starting a drag.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveTask((event.active.data.current?.task as TaskResponseDto | undefined) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const task = event.active.data.current?.task as TaskResponseDto | undefined;
    const toStatus = event.over?.id as TaskStatus | undefined;
    if (!task || !toStatus || toStatus === task.status) return;
    moveTaskStatus.mutate({ task, toStatus });
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {taskStatuses.map((status) => (
          <KanbanColumn
            key={status}
            workspaceSlug={workspaceSlug}
            projectSlug={project.slug}
            projectKey={project.key}
            status={status}
            assigneesById={assigneesById}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <KanbanCard
            href={`/workspaces/${workspaceSlug}/projects/${project.slug}/tasks/${activeTask.taskNumber}`}
            taskKey={`${project.key}-${activeTask.taskNumber}`}
            task={activeTask}
            assignee={activeTask.assigneeId ? assigneesById.get(activeTask.assigneeId) : undefined}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
