"use client";

import { useQuery } from "@tanstack/react-query";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";

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
      <CustomAvatar size="lg" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">{workspace.name}</h1>
        {workspace.description ? <p className="text-sm text-muted-foreground">{workspace.description}</p> : null}
      </div>
    </div>
  );
}
