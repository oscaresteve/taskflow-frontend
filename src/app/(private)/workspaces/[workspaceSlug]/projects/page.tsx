"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { SortControls } from "@/components/common/sort-controls";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

import { ICONS } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { useProjectRole } from "@/hooks/use-project-role";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { useParams } from "next/navigation";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import Link from "next/link";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { ColorDot } from "@/components/ui/color-dot";
import { getFullName } from "@/lib/utils";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectActionsMenu } from "@/components/projects/project-actions-menu";
import { EmptyState } from "@/components/common/empty-state";
import { useFormatter, useTranslations } from "next-intl";
import { ProjectSortField } from "@/lib/project-enums";
import useProjectsTable from "@/hooks/use-projects-table";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";

const MAX_VISIBLE_OWNERS = 4;

function ProjectRow({ workspaceSlug, project }: { workspaceSlug: string; project: ProjectResponseDto }) {
  const format = useFormatter();
  const {
    data: members,
    isLoading,
    isError,
  } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug: project.slug }));
  const { role: myRole } = useProjectRole(workspaceSlug, project.slug);
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);

  const owners = members?.filter((member) => member.role === "OWNER") ?? [];
  const visibleOwners = owners.slice(0, MAX_VISIBLE_OWNERS);
  const remainingOwners = owners.length - visibleOwners.length;

  const canManage = isProjectManager(myRole);

  return (
    <TableRow>
      <TableCell className="w-px">
        <FavoriteToggle isFavorite={project.isFavorite} onToggle={() => toggleFavorite.mutate(!project.isFavorite)} />
      </TableCell>
      <TableCell>
        <Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`} className="flex items-center gap-2">
          <ColorDot color={project.color} className="size-3" />
          <span className="truncate font-medium">{project.name}</span>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{project.slug}</TableCell>
      <TableCell className="text-muted-foreground">{project.key}</TableCell>
      <TableCell>
        {isError ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : isLoading || !members ? (
          <Skeleton className="h-6 w-16" />
        ) : owners.length === 0 ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : (
          <AvatarGroup>
            {visibleOwners.map((owner) => {
              const ownerName = getFullName(owner.user.firstName, owner.user.lastName);
              return (
                <CustomAvatar
                  key={owner.id}
                  size="sm"
                  avatarUrl={owner.user.avatarUrl}
                  alt={ownerName}
                  seed={owner.user.id}
                  variant="glyphs"
                />
              );
            })}
            {remainingOwners > 0 && <AvatarGroupCount>+{remainingOwners}</AvatarGroupCount>}
          </AvatarGroup>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{format.dateTime(new Date(project.createdAt), "short")}</TableCell>
      <TableCell>
        <ProjectActionsMenu workspaceSlug={workspaceSlug} project={project} canManage={canManage} />
      </TableCell>
    </TableRow>
  );
}

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { role: myWorkspaceRole } = useWorkspaceRole(workspaceSlug);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    search,
    sort,
    order,
    limit,
    page,
    searchParam,
    pageSizeOptions,
    onSearchChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  } = useProjectsTable();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    ...getProjectsQuery(workspaceSlug, { page, search: searchParam, limit, sort, order }),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("projectsPage.failedToLoad")}</p>;
  }

  if (isLoading || !projects) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const { pages: totalPages } = projects.pagination;

  const sortOptions: { value: ProjectSortField; label: string }[] = [
    { value: "name", label: t("projectsPage.sortOptions.name") },
    { value: "createdAt", label: t("projectsPage.sortOptions.createdAt") },
    { value: "updatedAt", label: t("projectsPage.sortOptions.updatedAt") },
  ];

  const hasActiveFilters = !!search;

  const emptyState = hasActiveFilters ? (
    <EmptyState
      icon={ICONS.project}
      title={t("projectsPage.noProjectsFound")}
      description={t("projectsPage.noProjectsFoundDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.project}
      title={t("projectsPage.noProjectsYet")}
      description={t("projectsPage.noProjectsYetDescription")}
      action={
        isWorkspaceManager(myWorkspaceRole) ? (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <ICONS.addNew />
            {t("projectsPage.newProject")}
          </Button>
        ) : undefined
      }
    />
  );

  return (
    <PageContainer>
      <PageHeader
        title={t("projectsPage.title")}
        actions={
          isWorkspaceManager(myWorkspaceRole) ? (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <ICONS.addNew />
              {t("projectsPage.newProject")}
            </Button>
          ) : null
        }
      />

      <div className="flex items-center justify-between gap-2">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t("projectsPage.searchPlaceholder")}
          className="w-48"
        />
        <div className="flex items-center gap-1">
          <SortControls
            field={sort}
            order={order}
            options={sortOptions}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
          <PageSizeSelect value={limit} options={pageSizeOptions} onChange={onLimitChange} />
        </div>
      </div>

      {projects.data.length === 0 ? (
        emptyState
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>{t("projectsPage.columns.project")}</TableHead>
              <TableHead>{t("projectsPage.columns.slug")}</TableHead>
              <TableHead>{t("projectsPage.columns.key")}</TableHead>
              <TableHead>{t("projectsPage.columns.owners")}</TableHead>
              <TableHead>{t("projectsPage.columns.createdAt")}</TableHead>
              <TableHead>{t("projectsPage.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.data.map((project) => (
              <ProjectRow key={project.id} workspaceSlug={workspaceSlug} project={project} />
            ))}
          </TableBody>
        </Table>
      )}

      {projects.data.length > 0 && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}

      <CreateProjectDialog open={createOpen} workspaceSlug={workspaceSlug} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
