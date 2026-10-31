"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ICONS, type Icon } from "@/lib/icons";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useProjectRole } from "@/hooks/use-project-role";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AddProjectMemberDialog } from "@/components/members/add-project-member-dialog";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { RowActionButton } from "@/components/common/row-action-button";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectMembersPanel } from "./_components/project-members-panel";
import { useUpdateProjectMember } from "@/hooks/use-update-project-member";
import { useDeactivateProjectMember } from "@/hooks/use-deactivate-project-member";
import { useActivateProjectMember } from "@/hooks/use-activate-project-member";
import { RestoreMemberDialog } from "@/components/members/restore-member-dialog";
import { ApiError } from "@/lib/http/api-error";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import type { ProjectMemberStatusTab } from "@/lib/member-enums";
import { getFullName } from "@/lib/utils";
import {
  assignableProjectRoles,
  canActivateProjectMember,
  canDeactivateProjectMember,
  canManageProject,
  canUpdateProjectMemberRole,
} from "@/lib/permissions/project-member-permissions";
import { Badge } from "@/components/ui/badge";
import { EnumBadge } from "@/components/common/enum-display";
import { projectMemberStatusTabs, roleOptions } from "@/lib/member-enums";
import { useTabParam } from "@/hooks/use-tab-param";

export default function ProjectMembersPage() {
  const t = useTranslations("members");
  const STATUS_TABS: { value: ProjectMemberStatusTab; label: string; icon: Icon }[] = [
    { value: "ACTIVE", label: t("projectMembersPage.tabActive"), icon: ICONS.memberActive },
    { value: "INACTIVE", label: t("projectMembersPage.tabInactive"), icon: ICONS.memberInactive },
  ];
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);
  const { role: myWorkspaceRole } = useWorkspaceRole(workspaceSlug);
  const updateProjectMember = useUpdateProjectMember(workspaceSlug, projectSlug);
  const deactivateProjectMember = useDeactivateProjectMember(workspaceSlug, projectSlug);
  const activateProjectMember = useActivateProjectMember(workspaceSlug, projectSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<ProjectMemberWithUserResponseDto | null>(null);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [memberToActivate, setMemberToActivate] = useState<ProjectMemberWithUserResponseDto | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: ProjectMemberWithUserResponseDto;
    role: ProjectRole;
  } | null>(null);
  const { tab: statusTab, onTabChange } = useTabParam(projectMemberStatusTabs, "ACTIVE");

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

  const assignableRoles = assignableProjectRoles({ workspaceRole: myWorkspaceRole, actorRole: myRole });

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : t("genericError"),
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
            description: t("projectMembersPage.roleChangedToast", {
              name: getFullName(member.user.firstName, member.user.lastName),
              role,
            }),
          });
        },
        onError: reportError,
      },
    );
  }

  function handleRequestActivate(member: ProjectMemberWithUserResponseDto) {
    setMemberToActivate(member);
    setActivateDialogOpen(true);
  }

  function handleConfirmActivate(role: ProjectRole) {
    if (!memberToActivate) return;
    activateProjectMember.mutate(
      { userId: memberToActivate.userId, data: { role } },
      {
        onSuccess: () => {
          setActivateDialogOpen(false);
          toast.add({
            type: "success",
            description: t("projectMembersPage.activatedToast", {
              name: getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName),
            }),
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
          description: t("projectMembersPage.deactivatedToast", {
            name: getFullName(memberToDeactivate.user.firstName, memberToDeactivate.user.lastName),
          }),
        });
      },
      onError: reportError,
    });
  }

  function roleChangeable(member: ProjectMemberWithUserResponseDto) {
    return canUpdateProjectMemberRole({
      actorUserId: me?.id,
      workspaceRole: myWorkspaceRole,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });
  }

  function renderActions(member: ProjectMemberWithUserResponseDto) {
    const deactivatable = canDeactivateProjectMember({
      actorUserId: me?.id,
      workspaceRole: myWorkspaceRole,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });
    const activatable = canActivateProjectMember({
      actorUserId: me?.id,
      workspaceRole: myWorkspaceRole,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });

    if (activatable) {
      return (
        <RowActionButton onClick={() => handleRequestActivate(member)}>
          <ICONS.memberActivate />
          {t("projectMembersPage.activate")}
        </RowActionButton>
      );
    }

    return deactivatable ? (
      <RowActionButton variant="destructive" onClick={() => handleRequestDeactivate(member)}>
        <ICONS.removeMember />
        {t("projectMembersPage.deactivate")}
      </RowActionButton>
    ) : null;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t("projectMembersPage.title")}
        actions={
          canManageProject({ workspaceRole: myWorkspaceRole, projectRole: myRole }) ? (
            <Button size="sm" onClick={() => setAddMemberOpen(true)}>
              <ICONS.memberAdd />
              {t("projectMembersPage.addMember")}
            </Button>
          ) : null
        }
      />

      <Tabs value={statusTab} onValueChange={(value) => onTabChange(value as ProjectMemberStatusTab)}>
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
        title={t.rich("projectMembersPage.deactivateMemberTitle", {
          name: memberToDeactivate
            ? getFullName(memberToDeactivate.user.firstName, memberToDeactivate.user.lastName)
            : "",
          ...richTitleTags,
        })}
        description={t("projectMembersPage.deactivateMemberDescription")}
        confirmLabel={t("projectMembersPage.deactivateConfirmLabel")}
        variant="destructive"
        onConfirm={handleConfirmDeactivate}
        pending={deactivateProjectMember.isPending}
        Icon={ICONS.removeMember}
      />
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title={t.rich("projectMembersPage.changeRoleTitle", {
          name: pendingRoleChange
            ? getFullName(pendingRoleChange.member.user.firstName, pendingRoleChange.member.user.lastName)
            : "",
          ...richTitleTags,
        })}
        description={
          pendingRoleChange
            ? t.rich("projectMembersPage.changeRoleDescription", {
                role: () => <EnumBadge className="align-middle" option={roleOptions[pendingRoleChange.role]} />,
              })
            : ""
        }
        confirmLabel={t("projectMembersPage.changeRoleConfirmLabel")}
        onConfirm={handleConfirmChangeRole}
        pending={updateProjectMember.isPending}
        Icon={ICONS.memberChangeRole}
      />
      <RestoreMemberDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        title={t("projectMembersPage.activateMemberTitle", {
          name: memberToActivate ? getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName) : "",
        })}
        description={t("projectMembersPage.activateMemberDescription")}
        roleLabel={t("projectMembersPage.activateRoleLabel")}
        roleDescription={t("projectMembersPage.activateRoleDescription")}
        submitLabel={t("projectMembersPage.activateConfirmLabel")}
        formId="activate-project-member-form"
        assignableRoles={assignableRoles}
        pending={activateProjectMember.isPending}
        onConfirm={handleConfirmActivate}
      />
    </PageContainer>
  );
}
