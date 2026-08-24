"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Clock, MoreHorizontal, UserCheck, UserPlus, Users } from "lucide-react";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getInitials } from "@/lib/utils";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { ApiError } from "@/lib/http/api-error";
import { WorkspaceMemberWithUserResponseDto } from "@/lib/dtos/workspace-members.dto";

function MemberRow({
  member,
  activatable,
  onActivate,
}: {
  member: WorkspaceMemberWithUserResponseDto;
  activatable: boolean;
  onActivate: (member: WorkspaceMemberWithUserResponseDto) => void;
}) {
  const user = member.user;

  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
      <Avatar size="sm">
        <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col truncate">
        <span className="truncate">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
      </div>
      <Badge variant="outline">{member.role}</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" disabled={!activatable} />}>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {member.status === "PENDING" ? (
            <DropdownMenuItem onClick={() => onActivate(member)}>
              <UserCheck />
              Activate
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem disabled>Change role</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" disabled>
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function WorkspaceMembersPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspaceMembers, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspaceSlug));
  const { data: me } = useQuery(getMeQuery());
  const activateWorkspaceMember = useActivateWorkspaceMember(workspaceSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (isLoading || !workspaceMembers) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const myRole = workspaceMembers.data.find((member) => member.userId === me?.id)?.role;
  const activeMembers = workspaceMembers.data.filter((member) => member.status === "ACTIVE");
  const pendingMembers = workspaceMembers.data.filter((member) => member.status === "PENDING");

  function canActivate(member: WorkspaceMemberWithUserResponseDto) {
    if (myRole !== "OWNER" && myRole !== "ADMIN") return false;
    if (myRole === "ADMIN" && member.role === "OWNER") return false;
    return true;
  }

  function handleActivate(member: WorkspaceMemberWithUserResponseDto) {
    activateWorkspaceMember.mutate(member.userId, {
      onError: (error) => {
        toast.add({
          type: "error",
          description: error instanceof ApiError ? error.message : "Something went wrong",
          priority: "high",
        });
      },
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Members
            <Badge variant="secondary">{activeMembers.length}</Badge>
          </CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setAddMemberOpen(true)}>
              <UserPlus />
              Add member
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {activeMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            activeMembers.map((member) => (
              <MemberRow key={member.id} member={member} activatable={false} onActivate={handleActivate} />
            ))
          )}
        </CardContent>
      </Card>

      {pendingMembers.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-4" />
              Pending
              <Badge variant="secondary">{pendingMembers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {pendingMembers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                activatable={canActivate(member)}
                onActivate={handleActivate}
              />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <AddMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
    </div>
  );
}
