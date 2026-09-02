"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { Button } from "@/components/ui/button";
import { PageSizeSelect } from "@/components/page-size-select";
import { PaginationControls } from "@/components/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortControls } from "@/components/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
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

const STATUS_FILTERS: StatusFilter[] = ["ALL", "ACTIVE", "PENDING", "REMOVED"];

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  ALL: "All statuses",
  ACTIVE: "Active",
  PENDING: "Pending",
  REMOVED: "Removed",
};

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

      <div className="flex flex-wrap items-center justify-end gap-2">
        <MembersFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
        />
        <Select value={statusFilter} onValueChange={(value) => value && handleStatusFilterChange(value as StatusFilter)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_FILTER_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SortControls
          field={sort}
          order={order}
          options={SORT_OPTIONS}
          onFieldChange={handleSortFieldChange}
          onOrderChange={handleSortOrderChange}
        />
        <PageSizeSelect value={limit} options={PAGE_SIZE_OPTIONS} onChange={handleLimitChange} />
      </div>

      <MembersTable
        members={members}
        assignableRoles={assignableRoles}
        roleChangeable={roleChangeable}
        onChangeRole={handleChangeRole}
        renderActions={renderActions}
        emptyMessage="No members found."
      />
      <PaginationControls page={page} totalPages={membersQuery.data.pagination.pages} onPageChange={setPage} />

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
