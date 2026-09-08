"use client";

import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { getInitials } from "@/lib/utils";

export function WorkspaceHeader({ workspaceSlug }: { workspaceSlug: string }) {
  const { data: workspace, isLoading } = useQuery(getWorkspaceQuery(workspaceSlug));

  if (isLoading || !workspace) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
        <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">{workspace.name}</h1>
        {workspace.description ? <p className="text-sm text-muted-foreground">{workspace.description}</p> : null}
      </div>
    </div>
  );
}
