"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { priorityVariant, statusLabel } from "@/lib/task-labels";
import { getInitials } from "@/lib/utils";

export default function TaskPage() {
  const { workspaceSlug, projectSlug, taskNumber } = useParams<{
    workspaceSlug: string;
    projectSlug: string;
    taskNumber: string;
  }>();
  const { data: task, isLoading: isTaskLoading, isError: isTaskError } = useQuery(
    getTaskQuery({ workspaceSlug, projectSlug, taskNumber }),
  );
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));

  if (isTaskError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load task.</p>;
  }

  if (isTaskLoading || !task) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  const assignee = project?.members.find((member) => member.userId === task.assigneeId)?.user;

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href={`/workspaces/${workspaceSlug}/projects/${projectSlug}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to project
      </Link>

      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {project?.key}-{task.taskNumber}
          </span>
          <h1 className="text-xl font-semibold">{task.title}</h1>
          {task.isArchived ? <Badge variant="outline">Archived</Badge> : null}
        </div>
        {task.description ? <p className="text-sm text-muted-foreground">{task.description}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <Badge variant="outline">{statusLabel[task.status]}</Badge>
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        <div className="flex items-center gap-2">
          {assignee ? (
            <>
              <Avatar size="sm">
                <AvatarImage src={assignee.avatarUrl ?? undefined} alt={assignee.name} />
                <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
              </Avatar>
              <span>{assignee.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          )}
        </div>
        {task.dueDate ? (
          <span className="text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</span>
        ) : null}
      </div>
    </div>
  );
}
