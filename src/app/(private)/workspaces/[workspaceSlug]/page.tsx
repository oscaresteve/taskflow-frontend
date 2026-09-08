"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Users } from "lucide-react";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ColorDot } from "@/components/ui/color-dot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFullName, getInitials } from "@/lib/utils";
import { PageContainer } from "@/components/common/page-container";
import { WorkspaceHeader } from "./_components/workspace-header";

export default function WorkspacePage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: projects, isLoading: isProjectsLoading } = useQuery(getProjectsQuery(workspaceSlug));
  const { data: members, isLoading: isMembersLoading } = useQuery(getWorkspaceMembersQuery(workspaceSlug));
  const activeMembers = members?.filter((member) => member.status === "ACTIVE") ?? [];

  return (
    <PageContainer className="flex flex-col gap-6">
      <WorkspaceHeader workspaceSlug={workspaceSlug} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="size-4" />
            Projects
            <Badge variant="secondary">{projects?.data.length ?? 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {isProjectsLoading || !projects ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : projects.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            projects.data.map((project) => (
              <Link
                key={project.id}
                href={`/workspaces/${workspaceSlug}/projects/${project.slug}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <ColorDot color={project.color} />
                <span className="flex-1 truncate">{project.name}</span>
                <span className="text-xs text-muted-foreground">{project.key}</span>
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
            <Badge variant="secondary">{activeMembers.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {isMembersLoading ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : activeMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            activeMembers.map((member) => {
              const memberName = getFullName(member.user.firstName, member.user.lastName);
              return (
                <div key={member.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
                  <Avatar size="sm">
                    <AvatarImage src={member.user.avatarUrl ?? undefined} alt={memberName} />
                    <AvatarFallback>{getInitials(memberName)}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate">{memberName}</span>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
