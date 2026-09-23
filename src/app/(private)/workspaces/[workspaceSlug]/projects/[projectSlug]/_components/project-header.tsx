"use client";

import { useQuery } from "@tanstack/react-query";
import { ColorDot } from "@/components/ui/color-dot";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectQuery } from "@/lib/queries/project.queries";

interface ProjectHeaderProps {
  workspaceSlug: string;
  projectSlug: string;
}

export function ProjectHeader({ workspaceSlug, projectSlug }: ProjectHeaderProps) {
  const { data: project, isLoading } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));

  if (isLoading || !project) {
    return (
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <ColorDot color={project.color} className="size-4" />
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <Badge variant="secondary">{project.key}</Badge>
      </div>
      {project.description ? <p className="text-sm text-muted-foreground">{project.description}</p> : null}
    </div>
  );
}
