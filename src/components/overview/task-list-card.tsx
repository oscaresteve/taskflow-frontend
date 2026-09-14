"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { OverviewTaskDto } from "@/lib/dtos/overview.dto";
import { TaskItem } from "./task-item";

interface TaskListCardProps {
  title: string;
  tasks: OverviewTaskDto[];
  isLoading?: boolean;
  emptyLabel: string;
  showProject?: boolean;
}

export function TaskListCard({ title, tasks, isLoading, emptyLabel, showProject }: TaskListCardProps) {
  // usePathname/useSearchParams son hooks: se llaman una vez aqui y buildTaskModalHref (funcion
  // normal) se usa por fila dentro del map.
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </>
        ) : tasks.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showProject={showProject}
              href={buildTaskModalHref({
                pathname,
                searchParams,
                workspaceSlug: task.project.workspaceSlug,
                projectSlug: task.project.slug,
                taskNumber: task.taskNumber,
              })}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
