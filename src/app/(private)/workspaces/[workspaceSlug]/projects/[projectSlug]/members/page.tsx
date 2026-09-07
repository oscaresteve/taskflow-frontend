"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CircleCheckIcon, CircleMinusIcon, type LucideIcon, UserCog, UserPlus, UserX } from "lucide-react";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useProjectRole } from "@/hooks/use-project-role";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AddProjectMemberDialog } from "@/components/members/add-project-member-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectMembersPanel } from "./_components/project-members-panel";
import { useUpdateProjectMember } from "@/hooks/use-update-project-member";
import { useDeactivateProjectMember } from "@/hooks/use-deactivate-project-member";
import { ApiError } from "@/lib/http/api-error";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import { getFullName } from "@/lib/utils";
import {
  assignableProjectRoles,
  canDeactivateProjectMember,
  canUpdateProjectMemberRole,
  isProjectManager,
} from "@/lib/permissions/project-member-permissions";
import { Badge } from "@/components/ui/badge";

type StatusTab = "ACTIVE" | "INACTIVE";

const STATUS_TABS: { value: StatusTab; label: string; icon: LucideIcon }[] = [
  { value: "ACTIVE", label: "Active", icon: CircleCheckIcon },
  { value: "INACTIVE", label: "Inactive", icon: CircleMinusIcon },
];

export default function ProjectMembersPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);
  const updateProjectMember = useUpdateProjectMember(workspaceSlug, projectSlug);
  const deactivateProjectMember = useDeactivateProjectMember(workspaceSlug, projectSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<ProjectMemberWithUserResponseDto | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: ProjectMemberWithUserResponseDto;
    role: ProjectRole;
  } | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>("ACTIVE");

  const activeCountQuery = useQuery(
    getProjectMembersPageQuery({ workspaceSlug, projectSlug, isActive: [true], page: 1, limit: 1 }),
  );
  const inactiveCountQuery = useQuery(
    getProjectMembersPageQuery({ workspaceSlug, projectSlug, isActive: [false], page: 1, limit: 1 }),
  );
  const countQueryByStatus = {
    ACTIVE: activeCountQuery,
    INACTIVE: inactiveCountQuery,
  };

  const assignableRoles = assignableProjectRoles(myRole);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleRequestChangeRole(member: ProjectMemberWithUserResponseDto, role: ProjectRole) {
    if (role === member.role) return;
    setPendingRoleChange({ member, role });
    setRoleChangeDialogOpen(true);
  }

  function handleConfirmChangeRole() {
    if (!pendingRoleChange) return;
    const { member, role } = pendingRoleChange;
    updateProjectMember.mutate(
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

  function handleRequestDeactivate(member: ProjectMemberWithUserResponseDto) {
    setMemberToDeactivate(member);
    setDeactivateDialogOpen(true);
  }

  function handleConfirmDeactivate() {
    if (!memberToDeactivate) return;
    deactivateProjectMember.mutate(memberToDeactivate.userId, {
      onSuccess: () => {
        setDeactivateDialogOpen(false);
        toast.add({
          type: "success",
          description: `${getFullName(memberToDeactivate.user.firstName, memberToDeactivate.user.lastName)} deactivated on this project.`,
        });
      },
      onError: reportError,
    });
  }

  function roleChangeable(member: ProjectMemberWithUserResponseDto) {
    return canUpdateProjectMemberRole({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });
  }

  function renderActions(member: ProjectMemberWithUserResponseDto) {
    const deactivatable = canDeactivateProjectMember({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });

    return deactivatable ? (
      <DropdownMenuItem variant="destructive" onClick={() => handleRequestDeactivate(member)}>
        <UserX />
        Deactivate
      </DropdownMenuItem>
    ) : null;
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <PageHeader
        title="Members"
        actions={
          isProjectManager(myRole) ? (
            <Button size="sm" onClick={() => setAddMemberOpen(true)}>
              <UserPlus />
              Add member
            </Button>
          ) : null
        }
      />

      <Tabs value={statusTab} onValueChange={(value) => setStatusTab(value as StatusTab)}>
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
            <ProjectMembersPanel
              workspaceSlug={workspaceSlug}
              projectSlug={projectSlug}
              isActive={tab.value === "ACTIVE"}
              assignableRoles={assignableRoles}
              roleChangeable={roleChangeable}
              onChangeRole={handleRequestChangeRole}
              renderActions={renderActions}
              actorUserId={me?.id}
            />
          </TabsContent>
        ))}
      </Tabs>

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
        description={`Deactivate ${memberToDeactivate ? getFullName(memberToDeactivate.user.firstName, memberToDeactivate.user.lastName) : ""} on this project? They'll lose access to it immediately.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleConfirmDeactivate}
        pending={deactivateProjectMember.isPending}
        Icon={UserX}
      />
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title="Change role"
        description={`Change ${pendingRoleChange ? getFullName(pendingRoleChange.member.user.firstName, pendingRoleChange.member.user.lastName) : ""}'s role to ${pendingRoleChange?.role}?`}
        confirmLabel="Change role"
        onConfirm={handleConfirmChangeRole}
        pending={updateProjectMember.isPending}
        Icon={UserCog}
      />
    </PageContainer>
  );
}
