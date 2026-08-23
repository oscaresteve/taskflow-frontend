"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { getProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

export default function ProjectMembersPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data, isLoading, isError } = useQuery(getProjectMembersQuery({ workspaceSlug, projectSlug }));

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const members = data.data;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Members
            <Badge variant="secondary">{data.pagination.total}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
                <Avatar size="sm">
                  <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.name} />
                  <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col truncate">
                  <span className="truncate">{member.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{member.user.email}</span>
                </div>
                {!member.isActive ? <Badge variant="secondary">Inactive</Badge> : null}
                <Badge variant="outline">{member.role}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
