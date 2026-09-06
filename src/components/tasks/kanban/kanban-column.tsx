"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { statusLabel } from "@/lib/task-labels";
import { cn } from "@/lib/utils";
import { SortableKanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  workspaceSlug: string;
  projectSlug: string;
  projectKey: string;
  status: TaskStatus;
  tasks: TaskResponseDto[];
  isDropTarget: boolean;
  assigneesById: Map<string, UserResponseDto>;
}

export function KanbanColumn({
  workspaceSlug,
  projectSlug,
  projectKey,
  status,
  tasks,
  isDropTarget,
  assigneesById,
}: KanbanColumnProps) {
  // El droppable de la columna recoge lo que se suelta fuera de una tarjeta: el hueco bajo la
  // ultima o una columna vacia, donde no hay ningun sortable al que apuntar. Su `isOver` no se usa;
  // el resaltado lo decide el board, que sabe en que columna va a caer la tarjeta.
  const { setNodeRef } = useDroppable({ id: status });

  // SortableContext reacciona a `items` por identidad, asi que se memoiza: crearlo en cada render
  // le haria recalcular su estado interno continuamente durante el arrastre.
  const itemIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn("flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-muted/30 p-2", isDropTarget && "bg-muted/60")}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-medium">{statusLabel[status]}</span>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <div className="flex min-h-16 flex-col gap-2">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="px-1 py-4 text-center text-sm text-muted-foreground">No tasks</p>
          ) : (
            tasks.map((task) => (
              <SortableKanbanCard
                key={task.id}
                href={`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${task.taskNumber}`}
                taskKey={`${projectKey}-${task.taskNumber}`}
                task={task}
                assignee={task.assigneeId ? assigneesById.get(task.assigneeId) : undefined}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
