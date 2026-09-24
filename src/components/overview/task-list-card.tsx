"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { OverviewTaskDto } from "@/lib/dtos/overview.dto";
import { ICONS } from "@/lib/icons";
import { TaskItem } from "./task-item";

interface TaskListCardProps {
  title: string;
  tasks: OverviewTaskDto[];
  isLoading?: boolean;
  emptyLabel: string;
  showProject?: boolean;
}

export function TaskListCard({ title, tasks, isLoading, emptyLabel, showProject }: TaskListCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </>
        ) : tasks.length === 0 ? (
          <EmptyInline icon={ICONS.task} label={emptyLabel} className="py-2" />
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
