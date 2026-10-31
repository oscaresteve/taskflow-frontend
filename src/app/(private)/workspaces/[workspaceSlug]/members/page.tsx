"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { ICONS, type Icon } from "@/lib/icons";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AddWorkspaceMemberDialog } from "@/components/members/add-workspace-member-dialog";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { RowActionButton } from "@/components/common/row-action-button";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceMembersPanel } from "./_components/workspace-members-panel";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { useUpdateWorkspaceMember } from "@/hooks/use-update-workspace-member";
import { useRemoveWorkspaceMember } from "@/hooks/use-remove-workspace-member";
import { useRestoreWorkspaceMember } from "@/hooks/use-restore-workspace-member";
import { useCancelWorkspaceMemberInvitation } from "@/hooks/use-cancel-workspace-member-invitation";
import { RestoreMemberDialog } from "@/components/members/restore-member-dialog";
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
  canCancelWorkspaceMemberInvitation,
  canRemoveWorkspaceMember,
  canRestoreWorkspaceMember,
  canUpdateWorkspaceMemberRole,
  isWorkspaceManager,
} from "@/lib/permissions/workspace-member-permissions";
import { Badge } from "@/components/ui/badge";
import { EnumBadge } from "@/components/common/enum-display";
import { roleOptions, workspaceMemberStatusTabs } from "@/lib/member-enums";
import { useTabParam } from "@/hooks/use-tab-param";

export default function WorkspaceMembersPage() {
  const t = useTranslations("members");
  const STATUS_TABS: Record<WorkspaceMemberStatus, { label: string; icon: Icon }> = {
    ACTIVE: { label: t("workspaceMembersPage.tabMembers"), icon: ICONS.memberActive },
    PENDING: { label: t("workspaceMembersPage.tabPending"), icon: ICONS.memberPending },
    REMOVED: { label: t("workspaceMembersPage.tabRemoved"), icon: ICONS.removeMember },
  };
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useWorkspaceRole(workspaceSlug);
  const activateWorkspaceMember = useActivateWorkspaceMember(workspaceSlug);
  const updateWorkspaceMember = useUpdateWorkspaceMember(workspaceSlug);
  const removeWorkspaceMember = useRemoveWorkspaceMember(workspaceSlug);
  const restoreWorkspaceMember = useRestoreWorkspaceMember(workspaceSlug);
  const cancelInvitation = useCancelWorkspaceMemberInvitation(workspaceSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [memberToActivate, setMemberToActivate] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [memberToRestore, setMemberToRestore] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    member: WorkspaceMemberWithUserResponseDto;
    role: WorkspaceRole;
  } | null>(null);

  // Pendientes y eliminados solo existen para quien puede aceptar y readmitir: a un miembro raso
  // esas pestanas no le ofrecen ninguna accion, asi que no se ensenan ni se cuentan.
  const canManageMembers = isWorkspaceManager(myRole);
  const availableTabs: readonly WorkspaceMemberStatus[] = canManageMembers ? workspaceMemberStatusTabs : ["ACTIVE"];

  const { tab: statusTab, onTabChange } = useTabParam(workspaceMemberStatusTabs, "ACTIVE", availableTabs);

  const activeCountQuery = useQuery(
    getWorkspaceMembersPageQuery({ workspaceSlug, status: ["ACTIVE"], page: 1, limit: 1 }),
  );
  const pendingCountQuery = useQuery({
    ...getWorkspaceMembersPageQuery({ workspaceSlug, status: ["PENDING"], page: 1, limit: 1 }),
    enabled: canManageMembers,
  });
  const removedCountQuery = useQuery({
    ...getWorkspaceMembersPageQuery({ workspaceSlug, status: ["REMOVED"], page: 1, limit: 1 }),
    enabled: canManageMembers,
  });
  const countQueryByStatus = {
    ACTIVE: activeCountQuery,
    PENDING: pendingCountQuery,
    REMOVED: removedCountQuery,
  };

  const assignableRoles = assignableWorkspaceRoles(myRole);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : t("genericError"),
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
          description: t("workspaceMembersPage.activatedToast", {
            name: getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName),
          }),
        });
      },
      onError: reportError,
    });
  }

  function handleRequestCancelInvitation(member: WorkspaceMemberWithUserResponseDto) {
    setInvitationToCancel(member);
    setCancelDialogOpen(true);
  }

  function handleConfirmCancelInvitation() {
    if (!invitationToCancel) return;
    cancelInvitation.mutate(invitationToCancel.userId, {
      onSuccess: () => {
        setCancelDialogOpen(false);
        toast.add({
          type: "success",
          description: t("workspaceMembersPage.canceledInvitationToast", {
            name: getFullName(invitationToCancel.user.firstName, invitationToCancel.user.lastName),
          }),
        });
      },
      onError: reportError,
    });
  }

  function handleRequestRestore(member: WorkspaceMemberWithUserResponseDto) {
    setMemberToRestore(member);
    setRestoreDialogOpen(true);
  }

  function handleConfirmRestore(role: WorkspaceRole) {
    if (!memberToRestore) return;
    restoreWorkspaceMember.mutate(
      { userId: memberToRestore.userId, data: { role } },
      {
        onSuccess: () => {
          setRestoreDialogOpen(false);
          toast.add({
            type: "success",
            description: t("workspaceMembersPage.restoredToast", {
              name: getFullName(memberToRestore.user.firstName, memberToRestore.user.lastName),
            }),
          });
        },
        onError: reportError,
      },
    );
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
          description: t("workspaceMembersPage.removedToast", {
            name: getFullName(memberToRemove.user.firstName, memberToRemove.user.lastName),
          }),
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
            description: t("workspaceMembersPage.roleChangedToast", {
              name: getFullName(member.user.firstName, member.user.lastName),
              role,
            }),
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
    const activatable = canActivateWorkspaceMember({
      actorRole: myRole,
      targetRole: member.role,
      targetStatus: member.status,
    });
    const restorable = canRestoreWorkspaceMember({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetStatus: member.status,
    });
    const removable = canRemoveWorkspaceMember({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetStatus: member.status,
    });

    // Cada pestana ofrece sus propias salidas y ninguna mas: readmitir al eliminado, dar de baja al
    // activo, y sobre una invitacion las dos que tiene: aceptarla o cancelarla. Cancelar no es dar
    // de baja —borra la invitacion— asi que el invitado no acaba en eliminados.
    if (member.status === "PENDING") {
      const cancelable = canCancelWorkspaceMemberInvitation({
        actorRole: myRole,
        targetRole: member.role,
        targetStatus: member.status,
      });

      if (!activatable && !cancelable) return null;

      return (
        <div className="flex items-center gap-1.5">
          {activatable && (
            <RowActionButton onClick={() => handleRequestActivate(member)}>
              <ICONS.memberActivate />
              {t("workspaceMembersPage.activate")}
            </RowActionButton>
          )}
          {/* Aceptar es lo que se viene a hacer aqui y lleva etiqueta; cancelar es descartar, asi
              que va en icono para que no compitan dos textos del mismo tamano. */}
          {cancelable && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <RowActionButton
                    variant="destructive"
                    size="icon-sm"
                    aria-label={t("workspaceMembersPage.cancelInvitation")}
                    onClick={() => handleRequestCancelInvitation(member)}
                  />
                }
              >
                <ICONS.cancel />
              </TooltipTrigger>
              <TooltipContent>{t("workspaceMembersPage.cancelInvitation")}</TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    }

    if (member.status === "REMOVED") {
      return restorable ? (
        <RowActionButton onClick={() => handleRequestRestore(member)}>
          <ICONS.memberRestore />
          {t("workspaceMembersPage.restore")}
        </RowActionButton>
      ) : null;
    }

    return removable ? (
      <RowActionButton variant="destructive" onClick={() => handleRequestRemove(member)}>
        <ICONS.removeMember />
        {t("workspaceMembersPage.remove")}
      </RowActionButton>
    ) : null;
  }

  return (
    <PageContainer>
      <PageHeader
        title={t("workspaceMembersPage.title")}
        actions={
          isWorkspaceManager(myRole) ? (
            <Button size="sm" onClick={() => setAddMemberOpen(true)}>
              <ICONS.memberAdd />
              {t("workspaceMembersPage.addMember")}
            </Button>
          ) : null
        }
      />

      <Tabs value={statusTab} onValueChange={(value) => onTabChange(value as WorkspaceMemberStatus)}>
        <div className="border-b">
          <TabsList variant="line">
            {availableTabs.map((status) => {
              const { label, icon: TabIcon } = STATUS_TABS[status];
              const total = countQueryByStatus[status].data?.pagination.total;
              return (
                <TabsTrigger key={status} value={status}>
                  <TabIcon />
                  {label}
                  {typeof total === "number" && <Badge variant="secondary">{total}</Badge>}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
        {availableTabs.map((status) => (
          <TabsContent key={status} value={status}>
            <WorkspaceMembersPanel
              workspaceSlug={workspaceSlug}
              status={status}
              assignableRoles={assignableRoles}
              roleChangeable={roleChangeable}
              onChangeRole={handleRequestChangeRole}
              renderActions={renderActions}
              onAddMember={isWorkspaceManager(myRole) ? () => setAddMemberOpen(true) : undefined}
              actorUserId={me?.id}
            />
          </TabsContent>
        ))}
      </Tabs>

      <AddWorkspaceMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title={t.rich("workspaceMembersPage.removeMemberTitle", {
          name: memberToRemove ? getFullName(memberToRemove.user.firstName, memberToRemove.user.lastName) : "",
          ...richTitleTags,
        })}
        description={t("workspaceMembersPage.removeMemberDescription")}
        confirmLabel={t("workspaceMembersPage.removeConfirmLabel")}
        variant="destructive"
        onConfirm={handleConfirmRemove}
        pending={removeWorkspaceMember.isPending}
        Icon={ICONS.removeMember}
      />
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title={t.rich("workspaceMembersPage.changeRoleTitle", {
          name: pendingRoleChange
            ? getFullName(pendingRoleChange.member.user.firstName, pendingRoleChange.member.user.lastName)
            : "",
          ...richTitleTags,
        })}
        description={
          pendingRoleChange
            ? t.rich("workspaceMembersPage.changeRoleDescription", {
                role: () => <EnumBadge className="align-middle" option={roleOptions[pendingRoleChange.role]} />,
              })
            : ""
        }
        confirmLabel={t("workspaceMembersPage.changeRoleConfirmLabel")}
        onConfirm={handleConfirmChangeRole}
        pending={updateWorkspaceMember.isPending}
        Icon={ICONS.memberChangeRole}
      />
      <ConfirmDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        title={t.rich("workspaceMembersPage.activateMemberTitle", {
          name: memberToActivate ? getFullName(memberToActivate.user.firstName, memberToActivate.user.lastName) : "",
          ...richTitleTags,
        })}
        description={t("workspaceMembersPage.activateMemberDescription")}
        confirmLabel={t("workspaceMembersPage.activateConfirmLabel")}
        onConfirm={handleConfirmActivate}
        pending={activateWorkspaceMember.isPending}
        Icon={ICONS.memberActivate}
      />
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title={t.rich("workspaceMembersPage.cancelInvitationTitle", {
          name: invitationToCancel
            ? getFullName(invitationToCancel.user.firstName, invitationToCancel.user.lastName)
            : "",
          ...richTitleTags,
        })}
        description={t("workspaceMembersPage.cancelInvitationDescription")}
        confirmLabel={t("workspaceMembersPage.cancelInvitationConfirmLabel")}
        variant="destructive"
        onConfirm={handleConfirmCancelInvitation}
        pending={cancelInvitation.isPending}
        Icon={ICONS.cancel}
      />
      <RestoreMemberDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        title={t("workspaceMembersPage.restoreMemberTitle", {
          name: memberToRestore ? getFullName(memberToRestore.user.firstName, memberToRestore.user.lastName) : "",
        })}
        description={t("workspaceMembersPage.restoreMemberDescription")}
        roleLabel={t("workspaceMembersPage.restoreRoleLabel")}
        roleDescription={t("workspaceMembersPage.restoreRoleDescription")}
        submitLabel={t("workspaceMembersPage.restoreConfirmLabel")}
        formId="restore-workspace-member-form"
        assignableRoles={assignableRoles}
        pending={restoreWorkspaceMember.isPending}
        onConfirm={handleConfirmRestore}
      />
    </PageContainer>
  );
}
