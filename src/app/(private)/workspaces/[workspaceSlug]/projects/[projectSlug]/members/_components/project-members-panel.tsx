"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { getProjectMembersPageQuery } from "@/lib/queries/project-member.queries";
import { MembersFilterBar } from "@/components/members/members-filter-bar";
import { MembersTable } from "@/components/members/members-table";
import { ListFooter } from "@/components/common/list-footer";
import { SortControl } from "@/components/common/sort-control";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { ICONS } from "@/lib/icons";
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
  // El subconjunto del ciclo de vida se pinta con los demas filtros, pero lo arma la pagina: es
  // quien sabe que subconjuntos puede ver este usuario y cuantos hay en cada uno.
  lifecycleFilter?: ReactNode;
  // La vista no tiene encabezado propio —el nombre lo da la pestana del proyecto—, asi que su
  // accion primaria cierra la barra de herramientas.
  actions?: ReactNode;
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
  lifecycleFilter,
  actions,
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
    sortIsDefault,
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

  const hasActiveFilters = !!search || roleFilter !== "ALL";

  const emptyState = hasActiveFilters ? (
    <EmptyState
      icon={ICONS.members}
      title={t("projectMembersPanel.emptyMessage")}
      description={t("projectMembersPanel.emptyMessageDescription")}
    />
  ) : isActive ? (
    <EmptyState
      icon={ICONS.members}
      title={t("projectMembersPage.emptyActive")}
      description={t("projectMembersPage.emptyActiveDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.members}
      title={t("projectMembersPage.emptyInactive")}
      description={t("projectMembersPage.emptyInactiveDescription")}
    />
  );

  return (
    // flex-1 para que el vacio de la tabla llene el alto que queda, no una franja bajo los filtros.
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <MembersFilterBar
            search={search}
            onSearchChange={onSearchChange}
            roleFilter={roleFilter}
            onRoleFilterChange={onRoleFilterChange}
          />
          {lifecycleFilter}
          <SortControl
            field={sort}
            order={order}
            options={SORT_OPTIONS}
            isDefault={sortIsDefault}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
        </div>
        {actions}
      </div>

      <MembersTable
        members={membersQuery.data.data}
        assignableRoles={assignableRoles}
        roleChangeable={roleChangeable}
        onChangeRole={onChangeRole}
        renderActions={renderActions}
        emptyState={emptyState}
        actorUserId={actorUserId}
      />
      {membersQuery.data.data.length > 0 && (
        <ListFooter
          limit={limit}
          pageSizeOptions={pageSizeOptions}
          onLimitChange={onLimitChange}
          page={page}
          totalPages={membersQuery.data.pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
