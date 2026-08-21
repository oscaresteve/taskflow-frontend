"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EditTaskForm } from "./_components/edit-task-form";

export default function TaskPage() {
  const { workspaceSlug, projectSlug, taskNumber } = useParams<{
    workspaceSlug: string;
    projectSlug: string;
    taskNumber: string;
  }>();
  const { data: task, isLoading, isError } = useQuery(getTaskQuery({ workspaceSlug, projectSlug, taskNumber }));
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load task.</p>;
  }

  if (isLoading || !task) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href={`/workspaces/${workspaceSlug}/projects/${projectSlug}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to project
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {project?.key}-{task.taskNumber}
        </span>
        {task.isArchived ? <Badge variant="outline">Archived</Badge> : null}
      </div>

      <div className="max-w-sm">
        <EditTaskForm />
      </div>
    </div>
  );
}
