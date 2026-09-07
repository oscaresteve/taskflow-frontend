"use client";

import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { SortOrder } from "@/lib/dtos/pagination.dto";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import { RoleFilter } from "@/lib/role-labels";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

type MemberSortField = "joinedAt" | "createdAt" | "updatedAt";

const SORT_OPTIONS: { value: MemberSortField; label: string }[] = [
  { value: "joinedAt", label: "Joined" },
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
];

interface ProjectMembersPanelProps {
  workspaceSlug: string;
  projectSlug: string;
  isActive: boolean;
  assignableRoles: ProjectRole[];
  roleChangeable: (member: ProjectMemberWithUserResponseDto) => boolean;
  onChangeRole: (member: ProjectMemberWithUserResponseDto, role: ProjectRole) => void;
  renderActions: (member: ProjectMemberWithUserResponseDto) => ReactNode | null;
  actorUserId?: string;
}

export function ProjectMembersPanel({
  workspaceSlug,
  projectSlug,
  isActive,
  assignableRoles,
  roleChangeable,
  onChangeRole,
  renderActions,
  actorUserId,
}: ProjectMembersPanelProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
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
      isActive: [isActive],
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
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MembersFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilterChange}
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
        members={membersQuery.data.data}
        assignableRoles={assignableRoles}
        roleChangeable={roleChangeable}
        onChangeRole={onChangeRole}
        renderActions={renderActions}
        emptyMessage="No members found."
        actorUserId={actorUserId}
      />
      <PaginationControls page={page} totalPages={membersQuery.data.pagination.pages} onPageChange={setPage} />
    </div>
  );
}
