"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Users } from "lucide-react";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";

export default function WorkspacePage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load workspace.</p>;
  }

  if (isLoading || !workspace) {
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

  return (
    <PageContainer className="flex flex-col gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="size-4" />
            Projects
            <Badge variant="secondary">{workspace.projects.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {workspace.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            workspace.projects.map((project) => (
              <Link
                key={project.id}
                href={`/workspaces/${workspaceSlug}/projects/${project.slug}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <span
                  className="size-2 shrink-0 rounded-full bg-muted-foreground"
                  style={project.color ? { backgroundColor: project.color } : undefined}
                />
                <span className="flex-1 truncate">{project.name}</span>
                <span className="text-xs text-muted-foreground">{project.key}</span>
                {project.isArchived ? <Badge variant="outline">Archived</Badge> : null}
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Members
            <Badge variant="secondary">{workspace.members.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {workspace.members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            workspace.members.map((member) => (
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
    </PageContainer>
  );
}
