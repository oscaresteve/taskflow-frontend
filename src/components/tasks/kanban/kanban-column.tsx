"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskStatus } from "@/lib/dtos/tasks.dto";
import { getTasksColumnQuery } from "@/lib/queries/task.queries";
import { statusLabel } from "@/lib/task-labels";
import { KanbanCard } from "./kanban-card";

const COLUMN_PAGE_SIZE = 25;

interface KanbanColumnProps {
  workspaceSlug: string;
  projectSlug: string;
  projectKey: string;
  status: TaskStatus;
  assigneesById: Map<string, UserResponseDto>;
}

export function KanbanColumn({ workspaceSlug, projectSlug, projectKey, status, assigneesById }: KanbanColumnProps) {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    getTasksColumnQuery(workspaceSlug, projectSlug, status, COLUMN_PAGE_SIZE),
  );

  const tasks = data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - tasks.length : 0;

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-muted/30 p-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-medium">{statusLabel[status]}</span>
        <Badge variant="outline">{total}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        {isError ? (
          <p className="px-1 py-4 text-center text-sm text-muted-foreground">Failed to load</p>
        ) : isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : tasks.length === 0 ? (
          <p className="px-1 py-4 text-center text-sm text-muted-foreground">No tasks</p>
        ) : (
          <>
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                href={`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${task.taskNumber}`}
                taskKey={`${projectKey}-${task.taskNumber}`}
                task={task}
                assignee={task.assigneeId ? assigneesById.get(task.assigneeId) : undefined}
              />
            ))}
            {hasNextPage && (
              <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? "Loading…" : `${remaining} more`}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
