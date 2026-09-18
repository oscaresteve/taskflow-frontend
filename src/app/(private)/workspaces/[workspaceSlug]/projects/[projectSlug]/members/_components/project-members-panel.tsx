"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import { useMemberTable } from "@/hooks/use-member-table";
import { MemberSortField } from "@/lib/member-enums";

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
  const t = useTranslations("members");
  const SORT_OPTIONS: { value: MemberSortField; label: string }[] = [
    { value: "joinedAt", label: t("projectMembersPanel.sortJoined") },
    { value: "createdAt", label: t("projectMembersPanel.sortCreated") },
    { value: "updatedAt", label: t("projectMembersPanel.sortUpdated") },
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

  if (membersQuery.isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("projectMembersPanel.failedToLoad")}</p>;
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
        emptyMessage={t("projectMembersPanel.emptyMessage")}
        actorUserId={actorUserId}
      />
      <PaginationControls page={page} totalPages={membersQuery.data.pagination.pages} onPageChange={onPageChange} />
    </div>
  );
}
