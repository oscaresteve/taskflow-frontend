"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, UserX, Users } from "lucide-react";
import { getProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { PageContainer } from "@/components/page-container";
import { AddProjectMemberDialog } from "@/components/add-project-member-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUpdateProjectMember } from "@/hooks/use-update-project-member";
import { useDeactivateProjectMember } from "@/hooks/use-deactivate-project-member";
import { ApiError } from "@/lib/http/api-error";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import {
  assignableProjectRoles,
  canDeactivateProjectMember,
  canUpdateProjectMemberRole,
  isProjectManager,
} from "@/lib/permissions/project-member-permissions";
import { getInitials } from "@/lib/utils";

export default function ProjectMembersPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data, isLoading, isError } = useQuery(getProjectMembersQuery({ workspaceSlug, projectSlug }));
  const { data: me } = useQuery(getMeQuery());
  const updateProjectMember = useUpdateProjectMember(workspaceSlug, projectSlug);
  const deactivateProjectMember = useDeactivateProjectMember(workspaceSlug, projectSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<ProjectMemberWithUserResponseDto | null>(null);

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (isLoading || !data) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const members = data.data;
  const myRole = members.find((member) => member.userId === me?.id)?.role;
  const assignableRoles = assignableProjectRoles(myRole);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleChangeRole(member: ProjectMemberWithUserResponseDto, role: ProjectRole) {
    if (role === member.role) return;
    updateProjectMember.mutate({ userId: member.userId, data: { role } }, { onError: reportError });
  }

  function handleRequestDeactivate(member: ProjectMemberWithUserResponseDto) {
    setMemberToDeactivate(member);
    setDeactivateDialogOpen(true);
  }

  function handleConfirmDeactivate() {
    if (!memberToDeactivate) return;
    deactivateProjectMember.mutate(memberToDeactivate.userId, {
      onSuccess: () => setDeactivateDialogOpen(false),
      onError: reportError,
    });
  }

  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Members
            <Badge variant="secondary">{data.pagination.total}</Badge>
          </CardTitle>
          {isProjectManager(myRole) ? (
            <CardAction>
              <Button size="sm" onClick={() => setAddMemberOpen(true)}>
                <UserPlus />
                Add member
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            members.map((member) => {
              const roleChangeable = canUpdateProjectMemberRole({
                actorUserId: me?.id,
                actorRole: myRole,
                targetUserId: member.userId,
                targetRole: member.role,
                targetIsActive: member.isActive,
              });
              const deactivatable = canDeactivateProjectMember({
                actorUserId: me?.id,
                actorRole: myRole,
                targetUserId: member.userId,
                targetRole: member.role,
                targetIsActive: member.isActive,
              });

              return (
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
                  {roleChangeable ? (
                    <Select
                      value={member.role}
                      onValueChange={(role) => handleChangeRole(member, role as ProjectRole)}
                    >
                      <SelectTrigger size="sm" className="h-auto border-transparent bg-transparent px-1 py-0.5 shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assignableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="px-1 text-sm">{member.role}</span>
                  )}
                  {deactivatable ? (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-sm text-destructive"
                      onClick={() => handleRequestDeactivate(member)}
                    >
                      Deactivate
                    </Button>
                  ) : null}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
      <AddProjectMemberDialog
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
      />
      <ConfirmDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        title="Deactivate member"
        description={`Deactivate ${memberToDeactivate?.user.name} on this project? They'll lose access to it immediately.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleConfirmDeactivate}
        pending={deactivateProjectMember.isPending}
        Icon={UserX}
      />
    </PageContainer>
  );
}
