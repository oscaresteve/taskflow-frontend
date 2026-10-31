"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { SortControls } from "@/components/common/sort-controls";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

import { ICONS, type Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ProjectListItemResponseDto } from "@/lib/dtos/projects.dto";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { useParams } from "next/navigation";
import { canManageProject, projectManagerRoles } from "@/lib/permissions/project-member-permissions";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import Link from "next/link";
import { OwnersCell } from "@/components/members/owners-cell";
import { ColorDot } from "@/components/ui/color-dot";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectActionsMenu } from "@/components/projects/project-actions-menu";
import { EmptyState } from "@/components/common/empty-state";
import { useFormatter, useTranslations } from "next-intl";
import { ProjectLifecycle, ProjectSortField, projectLifecycles } from "@/lib/project-enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTabParam } from "@/hooks/use-tab-param";
import useProjectsTable from "@/hooks/use-projects-table";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";

function ArchivedProjectRow({
  workspaceSlug,
  workspaceRole,
  project,
}: {
  workspaceSlug: string;
  workspaceRole: WorkspaceRole | undefined;
  project: ProjectListItemResponseDto;
}) {
  const format = useFormatter();

  return (
    <TableRow>
      <TableCell className="w-px" />
      <TableCell>
        <div className="flex items-center gap-2">
          <ColorDot color={project.color} className="size-3" />
          <span className="truncate font-medium text-muted-foreground">{project.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{project.slug}</TableCell>
      <TableCell className="text-muted-foreground">{project.key}</TableCell>
      <TableCell>
        <OwnersCell owners={project.owners} />
      </TableCell>
      <TableCell className="text-muted-foreground">{format.dateTime(new Date(project.createdAt), "short")}</TableCell>
      <TableCell>
        <ProjectActionsMenu
          workspaceSlug={workspaceSlug}
          project={project}
          canManage={canManageProject({ workspaceRole, projectRole: project.myRole })}
        />
      </TableCell>
    </TableRow>
  );
}

function ProjectRow({
  workspaceSlug,
  workspaceRole,
  project,
}: {
  workspaceSlug: string;
  workspaceRole: WorkspaceRole | undefined;
  project: ProjectListItemResponseDto;
}) {
  const format = useFormatter();
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);

  const canManage = canManageProject({ workspaceRole, projectRole: project.myRole });

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
        <OwnersCell owners={project.owners} />
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

  // Un proyecto archivado solo se ensena a quien puede desarchivarlo. Quien manda en el espacio
  // manda en todos sus proyectos, asi que no necesita filtro; al resto se le acota el listado a los
  // proyectos que dirige.
  const archivedRoles = isWorkspaceManager(myWorkspaceRole) ? undefined : projectManagerRoles;

  // Y la pestana solo aparece si hay algo que desarchivar. Se mide sin la busqueda de la tabla: si
  // dependiera de ella, escribir en el buscador haria desaparecer la pestana abierta.
  const manageableArchivedQuery = useQuery(
    getProjectsQuery(workspaceSlug, { page: 1, limit: 1, isArchived: true, myRole: archivedRoles }),
  );
  const availableTabs: readonly ProjectLifecycle[] = manageableArchivedQuery.data?.pagination.total
    ? projectLifecycles
    : ["ACTIVE"];

  const { tab, onTabChange } = useTabParam(projectLifecycles, "ACTIVE", availableTabs);

  const showingArchived = tab === "ARCHIVED";

  const LIFECYCLE_TABS: Record<ProjectLifecycle, { label: string; icon: Icon }> = {
    ACTIVE: { label: t("projectsPage.lifecycle.projects"), icon: ICONS.project },
    ARCHIVED: { label: t("projectsPage.lifecycle.archived"), icon: ICONS.archive },
  };

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    ...getProjectsQuery(workspaceSlug, {
      page,
      search: searchParam,
      limit,
      sort,
      order,
      isArchived: showingArchived,
      myRole: showingArchived ? archivedRoles : undefined,
    }),
    placeholderData: keepPreviousData,
  });

  // Un contador por pestana, igual que en miembros, acotado por la misma busqueda que la tabla.
  const activeCountQuery = useQuery(
    getProjectsQuery(workspaceSlug, { page: 1, limit: 1, search: searchParam, isArchived: false }),
  );
  const archivedCountQuery = useQuery(
    getProjectsQuery(workspaceSlug, {
      page: 1,
      limit: 1,
      search: searchParam,
      isArchived: true,
      myRole: archivedRoles,
    }),
  );
  const countQueryByTab = {
    ACTIVE: activeCountQuery,
    ARCHIVED: archivedCountQuery,
  };

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

  const hasActiveFilters = !!search || showingArchived;

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

      <Tabs className="gap-4" value={tab} onValueChange={(value) => onTabChange(value as ProjectLifecycle)}>
        <div className="border-b">
          <TabsList variant="line">
            {availableTabs.map((lifecycle) => {
              const { label, icon: TabIcon } = LIFECYCLE_TABS[lifecycle];
              const total = countQueryByTab[lifecycle].data?.pagination.total;
              return (
                <TabsTrigger key={lifecycle} value={lifecycle}>
                  <TabIcon />
                  {label}
                  {typeof total === "number" && <Badge variant="secondary">{total}</Badge>}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

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

        {availableTabs.map((lifecycle) => (
          <TabsContent key={lifecycle} value={lifecycle} className="flex flex-col gap-4">
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
                  {projects.data.map((project) =>
                    showingArchived ? (
                      <ArchivedProjectRow
                        key={project.id}
                        workspaceSlug={workspaceSlug}
                        workspaceRole={myWorkspaceRole}
                        project={project}
                      />
                    ) : (
                      <ProjectRow
                        key={project.id}
                        workspaceSlug={workspaceSlug}
                        workspaceRole={myWorkspaceRole}
                        project={project}
                      />
                    ),
                  )}
                </TableBody>
              </Table>
            )}

            {projects.data.length > 0 && (
              <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <CreateProjectDialog open={createOpen} workspaceSlug={workspaceSlug} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
