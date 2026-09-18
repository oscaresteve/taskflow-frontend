"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import {
  WorkspaceMemberStatus,
  WorkspaceMemberWithUserResponseDto,
  WorkspaceRole,
} from "@/lib/dtos/workspace-members.dto";
import { useMemberTable } from "@/hooks/use-member-table";
import { MemberSortField } from "@/lib/member-enums";

interface WorkspaceMembersPanelProps {
  workspaceSlug: string;
  status: WorkspaceMemberStatus;
  assignableRoles: WorkspaceRole[];
  roleChangeable: (member: WorkspaceMemberWithUserResponseDto) => boolean;
  onChangeRole: (member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) => void;
  renderActions: (member: WorkspaceMemberWithUserResponseDto) => ReactNode | null;
  actorUserId?: string;
}

export function WorkspaceMembersPanel({
  workspaceSlug,
  status,
  assignableRoles,
  roleChangeable,
  onChangeRole,
  renderActions,
  actorUserId,
}: WorkspaceMembersPanelProps) {
  const t = useTranslations("members");
  const SORT_OPTIONS: { value: MemberSortField; label: string }[] = [
    { value: "joinedAt", label: t("workspaceMembersPanel.sortJoined") },
    { value: "createdAt", label: t("workspaceMembersPanel.sortCreated") },
    { value: "updatedAt", label: t("workspaceMembersPanel.sortUpdated") },
  ];

  const {
    search,
    roleFilter,
    sort,
    order,
    limit,
    page,
    role,
    searchParam,
    pageSizeOptions,
    onSearchChange,
    onRoleFilterChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  } = useMemberTable();

  const membersQuery = useQuery(
    getWorkspaceMembersPageQuery({
      workspaceSlug,
      status: [status],
      role,
      search: searchParam,
      sort,
      order,
      page,
      limit,
    }),
  );

  if (membersQuery.isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("workspaceMembersPanel.failedToLoad")}</p>;
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
          onSearchChange={onSearchChange}
          roleFilter={roleFilter}
          onRoleFilterChange={onRoleFilterChange}
        />
        <div className="flex items-center gap-2">
          <SortControls
            field={sort}
            order={order}
            options={SORT_OPTIONS}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
          <PageSizeSelect value={limit} options={pageSizeOptions} onChange={onLimitChange} />
        </div>
      </div>

      <MembersTable
        members={membersQuery.data.data}
        assignableRoles={assignableRoles}
        roleChangeable={roleChangeable}
        onChangeRole={onChangeRole}
        renderActions={renderActions}
        emptyMessage={t("workspaceMembersPanel.emptyMessage")}
        actorUserId={actorUserId}
      />
      <PaginationControls page={page} totalPages={membersQuery.data.pagination.pages} onPageChange={onPageChange} />
    </div>
  );
}
