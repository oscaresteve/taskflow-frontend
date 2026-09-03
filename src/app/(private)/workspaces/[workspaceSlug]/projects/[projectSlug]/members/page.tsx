"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserCog, UserPlus, UserX } from "lucide-react";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useProjectRole } from "@/hooks/use-project-role";
import { Button } from "@/components/ui/button";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { AddProjectMemberDialog } from "@/components/members/add-project-member-dialog";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { PageContainer } from "@/components/common/page-container";
import { useUpdateProjectMember } from "@/hooks/use-update-project-member";
import { useDeactivateProjectMember } from "@/hooks/use-deactivate-project-member";
import { ApiError } from "@/lib/http/api-error";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import { RoleFilter } from "@/lib/member-role-filter";
import {
  assignableProjectRoles,
  canDeactivateProjectMember,
  canUpdateProjectMemberRole,
  isProjectManager,
} from "@/lib/permissions/project-member-permissions";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

type MemberSortField = "joinedAt" | "createdAt" | "updatedAt";

const SORT_OPTIONS: { value: MemberSortField; label: string }[] = [
  { value: "joinedAt", label: "Joined" },
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
];

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

function isActiveParam(statusFilter: StatusFilter): boolean[] {
  if (statusFilter === "ALL") return [true, false];
  return statusFilter === "ACTIVE" ? [true] : [false];
}

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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ACTIVE");
  const [sort, setSort] = useState<MemberSortField>("joinedAt");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const role = roleFilter === "ALL" ? undefined : roleFilter;
  const searchParam = search || undefined;

  const membersQuery = useQuery(
    getProjectMembersPageQuery({
      workspaceSlug,
      projectSlug,
      isActive: isActiveParam(statusFilter),
      role,
      search: searchParam,
      sort,
      order,
      page,
      limit,
    }),
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

  const assignableRoles = assignableProjectRoles(myRole);
  const members = membersQuery.data.data;

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
          toast.add({ type: "success", description: `${member.user.name}'s role changed to ${role}.` });
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
        toast.add({ type: "success", description: `${memberToDeactivate.user.name} deactivated on this project.` });
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
      <Button
        variant="link"
        className="h-auto p-0 text-sm text-destructive"
        onClick={() => handleRequestDeactivate(member)}
      >
        Deactivate
      </Button>
    ) : null;
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Members</h1>
        {isProjectManager(myRole) ? (
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
      <ConfirmDialog
        open={roleChangeDialogOpen}
        onOpenChange={setRoleChangeDialogOpen}
        title="Change role"
        description={`Change ${pendingRoleChange?.member.user.name}'s role to ${pendingRoleChange?.role}?`}
        confirmLabel="Change role"
        onConfirm={handleConfirmChangeRole}
        pending={updateProjectMember.isPending}
        Icon={UserCog}
      />
    </PageContainer>
  );
}
