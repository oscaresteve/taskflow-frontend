"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MembersFilterBar } from "@/components/members-filter-bar";
import { MembersTable } from "@/components/members-table";
import { PageContainer } from "@/components/page-container";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { useUpdateWorkspaceMember } from "@/hooks/use-update-workspace-member";
import { useRemoveWorkspaceMember } from "@/hooks/use-remove-workspace-member";
import { ApiError } from "@/lib/http/api-error";
import { WorkspaceMemberWithUserResponseDto, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import { RoleFilter, matchesMemberFilters } from "@/lib/member-role-filter";
import {
  assignableWorkspaceRoles,
  canActivateWorkspaceMember,
  canRemoveWorkspaceMember,
  canUpdateWorkspaceMemberRole,
  isWorkspaceManager,
} from "@/lib/permissions/workspace-member-permissions";

export default function WorkspaceMembersPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspaceMembers, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspaceSlug));
  const { data: me } = useQuery(getMeQuery());
  const activateWorkspaceMember = useActivateWorkspaceMember(workspaceSlug);
  const updateWorkspaceMember = useUpdateWorkspaceMember(workspaceSlug);
  const removeWorkspaceMember = useRemoveWorkspaceMember(workspaceSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (isLoading || !workspaceMembers) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const myRole = workspaceMembers.data.find((member) => member.userId === me?.id)?.role;
  const assignableRoles = assignableWorkspaceRoles(myRole);
  const filtered = workspaceMembers.data.filter((member) => matchesMemberFilters(member, search, roleFilter));
  const activeMembers = filtered.filter((member) => member.status === "ACTIVE");
  const pendingMembers = filtered.filter((member) => member.status === "PENDING");
  const removedMembers = filtered.filter((member) => member.status === "REMOVED");

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleActivate(member: WorkspaceMemberWithUserResponseDto) {
    activateWorkspaceMember.mutate(member.userId, { onError: reportError });
  }

  function handleRequestRemove(member: WorkspaceMemberWithUserResponseDto) {
    setMemberToRemove(member);
    setRemoveDialogOpen(true);
  }

  function handleConfirmRemove() {
    if (!memberToRemove) return;
    removeWorkspaceMember.mutate(memberToRemove.userId, {
      onSuccess: () => setRemoveDialogOpen(false),
      onError: reportError,
    });
  }

  function handleChangeRole(member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) {
    if (role === member.role) return;
    updateWorkspaceMember.mutate({ userId: member.userId, data: { role } }, { onError: reportError });
  }

  function roleChangeable(member: WorkspaceMemberWithUserResponseDto) {
    return canUpdateWorkspaceMemberRole({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetStatus: member.status,
    });
  }

  function renderActions(member: WorkspaceMemberWithUserResponseDto) {
    const activatable =
      member.status === "PENDING" && canActivateWorkspaceMember({ actorRole: myRole, targetRole: member.role });
    const removable = canRemoveWorkspaceMember({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetStatus: member.status,
    });

    return (
      <>
        {activatable ? (
          <Button variant="link" className="h-auto p-0 text-sm" onClick={() => handleActivate(member)}>
            Activate
          </Button>
        ) : null}
        {removable ? (
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-destructive"
            onClick={() => handleRequestRemove(member)}
          >
            Remove
          </Button>
        ) : null}
      </>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Members</h1>
        {isWorkspaceManager(myRole) ? (
          <Button size="sm" onClick={() => setAddMemberOpen(true)}>
            <UserPlus />
            Add member
          </Button>
        ) : null}
      </div>

      <Tabs defaultValue="active">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="active">
              Current members
              <Badge variant="secondary">{activeMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary">{pendingMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="removed">
              Removed
              <Badge variant="secondary">{removedMembers.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <MembersFilterBar
            search={search}
            onSearchChange={setSearch}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
          />
        </div>

        <TabsContent value="active">
          <MembersTable
            members={activeMembers}
            assignableRoles={assignableRoles}
            roleChangeable={roleChangeable}
            onChangeRole={handleChangeRole}
            renderActions={renderActions}
            emptyMessage="No members found."
          />
        </TabsContent>
        <TabsContent value="pending">
          <MembersTable
            members={pendingMembers}
            assignableRoles={assignableRoles}
            roleChangeable={roleChangeable}
            onChangeRole={handleChangeRole}
            renderActions={renderActions}
            emptyMessage="No pending members."
          />
        </TabsContent>
        <TabsContent value="removed">
          <MembersTable
            members={removedMembers}
            assignableRoles={assignableRoles}
            roleChangeable={roleChangeable}
            onChangeRole={handleChangeRole}
            renderActions={renderActions}
            emptyMessage="No removed members."
          />
        </TabsContent>
      </Tabs>

      <AddMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove member"
        description={`Remove ${memberToRemove?.user.name} from this workspace? They'll lose access immediately.`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleConfirmRemove}
        pending={removeWorkspaceMember.isPending}
        Icon={UserX}
      />
    </PageContainer>
  );
}
