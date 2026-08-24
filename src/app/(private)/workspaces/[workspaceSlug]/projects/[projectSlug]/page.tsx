"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Plus } from "lucide-react";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getTasksQuery } from "@/lib/queries/task.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { priorityVariant, statusLabel } from "@/lib/task-labels";
import { CreateTaskDialog } from "@/components/create-task-dialog";
import { PageContainer } from "@/components/page-container";

export default function ProjectPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useQuery(getTasksQuery(workspaceSlug, projectSlug));
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load project.</p>;
  }

  if (isLoading || !project) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </PageContainer>
    );
  }

  const usersById = new Map(project.members.map((member) => [member.userId, member.user]));

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="size-4" />
            Tasks
            <Badge variant="secondary">{tasks?.pagination.total ?? 0}</Badge>
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setCreateTaskOpen(true)}>
              <Plus />
              New task
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {isTasksError ? (
            <p className="text-sm text-muted-foreground">Failed to load tasks.</p>
          ) : isTasksLoading || !tasks ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : tasks.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          ) : (
            tasks.data.map((task) => {
              const assignee = task.assigneeId ? usersById.get(task.assigneeId) : undefined;
              return (
                <Link
                  key={task.id}
                  href={`/workspaces/${workspaceSlug}/projects/${projectSlug}/tasks/${task.taskNumber}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span className="text-xs text-muted-foreground">
                    {project.key}-{task.taskNumber}
                  </span>
                  <span className="flex-1 truncate">{task.title}</span>
                  <Badge variant="outline">{statusLabel[task.status]}</Badge>
                  <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                  {assignee ? (
                    <Avatar size="sm">
                      <AvatarImage src={assignee.avatarUrl ?? undefined} alt={assignee.name} />
                      <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                    </Avatar>
                  ) : null}
                </Link>
              );
            })
          )}
        </CardContent>
      </Card>
      <CreateTaskDialog project={project} open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </PageContainer>
  );
}
