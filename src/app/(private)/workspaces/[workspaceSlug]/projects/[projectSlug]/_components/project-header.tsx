"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getInitials } from "@/lib/utils";

interface ProjectHeaderProps {
  workspaceSlug: string;
  projectSlug: string;
}

export function ProjectHeader({ workspaceSlug, projectSlug }: ProjectHeaderProps) {
  const { data: project, isLoading } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));

  if (isLoading || !project) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid gap-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  return (
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
        </div>
        {project.description ? <p className="text-sm text-muted-foreground">{project.description}</p> : null}
      </div>
    </div>
  );
}
