"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, UserCog, UserPlus, UserX } from "lucide-react";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Button } from "@/components/ui/button";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { AddWorkspaceMemberDialog } from "@/components/members/add-workspace-member-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { PageContainer } from "@/components/common/page-container";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { useUpdateWorkspaceMember } from "@/hooks/use-update-workspace-member";
import { useRemoveWorkspaceMember } from "@/hooks/use-remove-workspace-member";
import { ApiError } from "@/lib/http/api-error";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { WorkspaceMemberStatus, WorkspaceMemberWithUserResponseDto, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import { RoleFilter } from "@/lib/member-role-filter";
import {
  assignableWorkspaceRoles,
  canActivateWorkspaceMember,
  canRemoveWorkspaceMember,
  canUpdateWorkspaceMemberRole,
  isWorkspaceManager,
} from "@/lib/permissions/workspace-member-permissions";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

type MemberSortField = "joinedAt" | "createdAt" | "updatedAt";

const SORT_OPTIONS: { value: MemberSortField; label: string }[] = [
  { value: "joinedAt", label: "Joined" },
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
];

type StatusFilter = "ALL" | WorkspaceMemberStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "REMOVED", label: "Removed" },
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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ACTIVE");
  const [sort, setSort] = useState<MemberSortField>("joinedAt");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const role = roleFilter === "ALL" ? undefined : roleFilter;
  const status = statusFilter === "ALL" ? (["ACTIVE", "PENDING", "REMOVED"] as WorkspaceMemberStatus[]) : [statusFilter];
  const searchParam = search || undefined;

  const membersQuery = useQuery(
    getWorkspaceMembersPageQuery({ workspaceSlug, status, role, search: searchParam, sort, order, page, limit }),
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleFilterChange(value: RoleFilter) {
    setRoleFilter(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSortFieldChange(value: MemberSortField) {
    setSort(value);
    setPage(1);
  }

  function handleSortOrderChange(value: SortOrder) {
    setOrder(value);
    setPage(1);
  }

  function handleLimitChange(value: number) {
    setLimit(value);
    setPage(1);
  }

  if (membersQuery.isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (!membersQuery.data) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const assignableRoles = assignableWorkspaceRoles(myRole);
  const members = membersQuery.data.data;

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
      onSuccess: () => setActivateDialogOpen(false),
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
      onSuccess: () => setRemoveDialogOpen(false),
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
        onSuccess: () => setRoleChangeDialogOpen(false),
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

    return (
      <>
        {activatable ? (
          <Button variant="link" className="h-auto p-0 text-sm" onClick={() => handleRequestActivate(member)}>
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

      <div className="flex flex-wrap items-center justify-between gap-2">
        <MembersFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          statusOptions={STATUS_OPTIONS}
        />
        <div className="flex items-center gap-2">
          <SortControls
            field={sort}
            order={order}
            options={SORT_OPTIONS}
            onFieldChange={handleSortFieldChange}
            onOrderChange={handleSortOrderChange}
          />
          <PageSizeSelect value={limit} options={PAGE_SIZE_OPTIONS} onChange={handleLimitChange} />
        </div>
      </div>

      <MembersTable
        members={members}
        assignableRoles={assignableRoles}
        roleChangeable={roleChangeable}
        onChangeRole={handleRequestChangeRole}
        renderActions={renderActions}
        emptyMessage="No members found."
      />
      <PaginationControls page={page} totalPages={membersQuery.data.pagination.pages} onPageChange={setPage} />

      <AddWorkspaceMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
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
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title="Change role"
        description={`Change ${pendingRoleChange?.member.user.name}'s role to ${pendingRoleChange?.role}?`}
        confirmLabel="Change role"
        onConfirm={handleConfirmChangeRole}
        pending={updateWorkspaceMember.isPending}
        Icon={UserCog}
      />
      <ConfirmDialog
        open={activateDialogOpen}
        onOpenChange={setActivateDialogOpen}
        title="Activate member"
        description={`Activate ${memberToActivate?.user.name}? They'll get immediate access to this workspace.`}
        confirmLabel="Activate"
        onConfirm={handleConfirmActivate}
        pending={activateWorkspaceMember.isPending}
        Icon={UserCheck}
      />
    </PageContainer>
  );
}
