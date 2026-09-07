"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CircleCheckIcon,
  ClockIcon,
  type LucideIcon,
  UserCheck,
  UserCog,
  UserPlus,
  UserX,
  UserXIcon,
} from "lucide-react";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AddWorkspaceMemberDialog } from "@/components/members/add-workspace-member-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceMembersPanel } from "./_components/workspace-members-panel";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { useUpdateWorkspaceMember } from "@/hooks/use-update-workspace-member";
import { useRemoveWorkspaceMember } from "@/hooks/use-remove-workspace-member";
import { ApiError } from "@/lib/http/api-error";
import {
  WorkspaceMemberStatus,
  WorkspaceMemberWithUserResponseDto,
  WorkspaceRole,
} from "@/lib/dtos/workspace-members.dto";
import { getFullName } from "@/lib/utils";
import {
  assignableWorkspaceRoles,
  canActivateWorkspaceMember,
  canRemoveWorkspaceMember,
  canUpdateWorkspaceMemberRole,
  isWorkspaceManager,
} from "@/lib/permissions/workspace-member-permissions";
import { Badge } from "@/components/ui/badge";
import { roleLabel } from "@/lib/role-labels";

const STATUS_TABS: { value: WorkspaceMemberStatus; label: string; icon: LucideIcon }[] = [
  { value: "ACTIVE", label: "Active", icon: CircleCheckIcon },
  { value: "PENDING", label: "Pending", icon: ClockIcon },
  { value: "REMOVED", label: "Removed", icon: UserXIcon },
];

export default function WorkspaceMembersPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useWorkspaceRole(workspaceSlug);
  const activateWorkspaceMember = useActivateWorkspaceMember(workspaceSlug);
  const updateWorkspaceMember = useUpdateWorkspaceMember(workspaceSlug);
  const removeWorkspaceMember = useRemoveWorkspaceMember(workspaceSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [memberToActivate, setMemberToActivate] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: WorkspaceMemberWithUserResponseDto;
    role: WorkspaceRole;
  } | null>(null);
  const [statusTab, setStatusTab] = useState<WorkspaceMemberStatus>("ACTIVE");

  const activeCountQuery = useQuery(
    getWorkspaceMembersPageQuery({ workspaceSlug, status: ["ACTIVE"], page: 1, limit: 1 }),
  );
  const pendingCountQuery = useQuery(
    getWorkspaceMembersPageQuery({ workspaceSlug, status: ["PENDING"], page: 1, limit: 1 }),
  );
  const removedCountQuery = useQuery(
    getWorkspaceMembersPageQuery({ workspaceSlug, status: ["REMOVED"], page: 1, limit: 1 }),
  );
  const countQueryByStatus = {
    ACTIVE: activeCountQuery,
    PENDING: pendingCountQuery,
    REMOVED: removedCountQuery,
  };

  const assignableRoles = assignableWorkspaceRoles(myRole);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleRequestActivate(member: WorkspaceMemberWithUserResponseDto) {
    setMemberToActivate(member);
    setActivateDialogOpen(true);
  }

  function handleConfirmActivate() {
    if (!memberToActivate) return;
    activateWorkspaceMember.mutate(memberToActivate.userId, {
      onSuccess: () => {
        setActivateDialogOpen(false);
        toast.add({
          type: "success",
          description: `${getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName)} activated.`,
        });
      },
      onError: reportError,
    });
  }

  function handleRequestRemove(member: WorkspaceMemberWithUserResponseDto) {
    setMemberToRemove(member);
    setRemoveDialogOpen(true);
  }

  function handleConfirmRemove() {
    if (!memberToRemove) return;
    removeWorkspaceMember.mutate(memberToRemove.userId, {
      onSuccess: () => {
        setRemoveDialogOpen(false);
        toast.add({
          type: "success",
          description: `${getFullName(memberToRemove.user.firstName, memberToRemove.user.lastName)} removed from the workspace.`,
        });
      },
      onError: reportError,
    });
  }

  function handleRequestChangeRole(member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) {
    if (role === member.role) return;
    setPendingRoleChange({ member, role });
    setRoleChangeDialogOpen(true);
  }

  function handleConfirmChangeRole() {
    if (!pendingRoleChange) return;
    const { member, role } = pendingRoleChange;
    updateWorkspaceMember.mutate(
      { userId: member.userId, data: { role } },
      {
        onSuccess: () => {
          setRoleChangeDialogOpen(false);
          toast.add({
            type: "success",
            description: `${getFullName(member.user.firstName, member.user.lastName)}'s role changed to ${role}.`,
          });
        },
        onError: reportError,
      },
    );
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

    if (!activatable && !removable) return null;

    return (
      <>
        {activatable && (
          <DropdownMenuItem onClick={() => handleRequestActivate(member)}>
            <UserCheck />
            Activate
          </DropdownMenuItem>
        )}
        {activatable && removable && <DropdownMenuSeparator />}
        {removable && (
          <DropdownMenuItem variant="destructive" onClick={() => handleRequestRemove(member)}>
            <UserX />
            Remove
          </DropdownMenuItem>
        )}
      </>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <PageHeader
        title="Members"
        actions={
          isWorkspaceManager(myRole) ? (
            <Button size="sm" onClick={() => setAddMemberOpen(true)}>
              <UserPlus />
              Add member
            </Button>
          ) : null
        }
      />

      <Tabs value={statusTab} onValueChange={(value) => setStatusTab(value as WorkspaceMemberStatus)}>
        <div className="border-b">
          <TabsList variant="line">
            {STATUS_TABS.map((tab) => {
              const total = countQueryByStatus[tab.value].data?.pagination.total;
              return (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon />
                  {tab.label}
                  {typeof total === "number" && <Badge variant="secondary">{total}</Badge>}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <WorkspaceMembersPanel
              workspaceSlug={workspaceSlug}
              status={tab.value}
              assignableRoles={assignableRoles}
              roleChangeable={roleChangeable}
              onChangeRole={handleRequestChangeRole}
              renderActions={renderActions}
              actorUserId={me?.id}
            />
          </TabsContent>
        ))}
      </Tabs>

      <AddWorkspaceMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove member"
        description={
          memberToRemove
            ? `Remove ${getFullName(memberToRemove.user.firstName, memberToRemove.user.lastName)} from this workspace? They'll lose access immediately.`
            : ""
        }
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleConfirmRemove}
        pending={removeWorkspaceMember.isPending}
        Icon={UserX}
      />
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title="Change role"
        description={
          pendingRoleChange
            ? `Change ${getFullName(pendingRoleChange.member.user.firstName, pendingRoleChange.member.user.lastName)}'s role? They'll get ${roleLabel[pendingRoleChange.role]} access to this workspace.`
            : ""
        }
        confirmLabel="Change"
        onConfirm={handleConfirmChangeRole}
        pending={updateWorkspaceMember.isPending}
        Icon={UserCog}
      />
      <ConfirmDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        title="Activate member"
        description={
          memberToActivate
            ? `Activate ${getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName)}? They'll get immediate access to this workspace.`
            : ""
        }
        confirmLabel="Activate"
        onConfirm={handleConfirmActivate}
        pending={activateWorkspaceMember.isPending}
        Icon={UserCheck}
      />
    </PageContainer>
  );
}
