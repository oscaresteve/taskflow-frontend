"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Plus, Settings, Users } from "lucide-react";
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
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
    );
  }

  const usersById = new Map(project.members.map((member) => [member.userId, member.user]));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarFallback style={project.color ? { backgroundColor: project.color, color: "#fff" } : undefined}>
            {project.icon ?? getInitials(project.name)}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{project.name}</h1>
            <Badge variant="secondary">{project.key}</Badge>
            {project.isArchived ? <Badge variant="outline">Archived</Badge> : null}
          </div>
          {project.description ? <p className="text-sm text-muted-foreground">{project.description}</p> : null}
          <p className="text-xs text-muted-foreground">{project.workspace.name}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="ml-auto"
          nativeButton={false}
          render={<Link href={`/workspaces/${workspaceSlug}/projects/${projectSlug}/settings`} />}
        >
          <Settings />
        </Button>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Members
            <Badge variant="secondary">{project.members.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {project.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            project.members.map((member) => (
              <div key={member.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
                <Avatar size="sm">
                  <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.name} />
                  <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate">{member.user.name}</span>
                <Badge variant="outline">{member.role}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <CreateTaskDialog project={project} open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </div>
  );
}
