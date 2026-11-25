"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ICONS } from "@/lib/icons";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { isWorkspaceManager, workspaceManagerRoles } from "@/lib/permissions/workspace-member-permissions";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { OwnersCell } from "@/components/members/owners-cell";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { ListFooter } from "@/components/common/list-footer";
import { SortControl } from "@/components/common/sort-control";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceActionsMenu } from "@/components/workspaces/workspace-actions-menu";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { LifecycleFilter } from "@/components/common/lifecycle-filter";
import { EmptyState } from "@/components/common/empty-state";
import { WorkspaceListItemResponseDto } from "@/lib/dtos/workspaces.dto";
import { WorkspaceLifecycle, WorkspaceSortField, workspaceLifecycles } from "@/lib/workspace-enums";
import { useTabParam } from "@/hooks/use-tab-param";
import { useWorkspacesTable } from "@/hooks/use-workspaces-table";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";

function ActiveWorkspaceRow({ workspace }: { workspace: WorkspaceListItemResponseDto }) {
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);

  return (
    <TableRow>
      <TableCell className="w-px">
        <FavoriteToggle
          isFavorite={workspace.isFavorite}
          onToggle={() => toggleFavorite.mutate(!workspace.isFavorite)}
        />
      </TableCell>
      <TableCell>
        <Link href={`/workspaces/${workspace.slug}`} className="flex items-center gap-2">
          <CustomAvatar size="sm" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
          <span className="truncate font-medium">{workspace.name}</span>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{workspace.slug}</TableCell>
      <TableCell>
        <OwnersCell owners={workspace.owners} />
      </TableCell>
      <TableCell>
        <WorkspaceActionsMenu workspace={workspace} canManage={isWorkspaceManager(workspace.myRole)} />
      </TableCell>
    </TableRow>
  );
}

function InactiveWorkspaceRow({ workspace }: { workspace: WorkspaceListItemResponseDto }) {
  return (
    <TableRow>
      <TableCell className="w-px" />
      <TableCell>
        <div className="flex items-center gap-2">
          <CustomAvatar size="sm" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
          <span className="truncate font-medium text-muted-foreground">{workspace.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{workspace.slug}</TableCell>
      <TableCell>
        <OwnersCell owners={workspace.owners} />
      </TableCell>
      <TableCell>
        <WorkspaceActionsMenu workspace={workspace} canManage={isWorkspaceManager(workspace.myRole)} />
      </TableCell>
    </TableRow>
  );
}

export default function WorkspacesPage() {
  const t = useTranslations("workspaces");
  const [createOpen, setCreateOpen] = useState(false);
  const sortOptions: { value: WorkspaceSortField; label: string }[] = [
    { value: "name", label: t("workspacesPage.sort.name") },
    { value: "createdAt", label: t("workspacesPage.sort.createdAt") },
    { value: "updatedAt", label: t("workspacesPage.sort.updatedAt") },
  ];

  const {
    search,
    sort,
    order,
    sortIsDefault,
    limit,
    page,
    searchParam,
    pageSizeOptions,
    onSearchChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  } = useWorkspacesTable();

  // Un espacio desactivado solo se ensena a quien puede reactivarlo, y la pestana solo aparece si
  // hay alguno. Se mide sin la busqueda de la tabla: si dependiera de ella, escribir en el buscador
  // haria desaparecer la pestana abierta.
  const manageableInactiveQuery = useQuery(
    getWorkspacesQuery({ page: 1, limit: 1, isActive: false, myRole: workspaceManagerRoles }),
  );
  const availableTabs: readonly WorkspaceLifecycle[] = manageableInactiveQuery.data?.pagination.total
    ? workspaceLifecycles
    : ["ACTIVE"];

  const { tab, onTabChange } = useTabParam(workspaceLifecycles, "ACTIVE", availableTabs);

  const showingInactive = tab === "INACTIVE";

  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    ...getWorkspacesQuery({
      page,
      search: searchParam,
      limit,
      sort,
      order,
      isActive: !showingInactive,
      myRole: showingInactive ? workspaceManagerRoles : undefined,
    }),
    placeholderData: keepPreviousData,
  });

  // El contador del chip: la propia busqueda lo acota, para que el numero cuadre con lo que la tabla
  // ensena al pulsarlo. Los activos no lo necesitan: son lo que ya estas mirando.
  const inactiveCountQuery = useQuery(
    getWorkspacesQuery({ page: 1, limit: 1, search: searchParam, isActive: false, myRole: workspaceManagerRoles }),
  );

  const lifecycleOptions = availableTabs.includes("INACTIVE")
    ? [
        {
          value: "INACTIVE" as const,
          label: t("workspacesPage.lifecycle.inactive"),
          icon: ICONS.deactivate,
          count: inactiveCountQuery.data?.pagination.total,
        },
      ]
    : [];

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("workspacesPage.failedToLoad")}</p>;
  }

  if (isLoading || !workspaces) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const { pages: totalPages } = workspaces.pagination;

  return (
    <PageContainer className="flex-1">
      <PageHeader
        title={t("workspacesPage.title")}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <ICONS.addNew />
            {t("workspacesPage.newWorkspace")}
          </Button>
        }
      />

      {/* flex-1 hasta el vacio: cuando no hay filas, el EmptyState llena el alto que queda en vez
          de quedarse en una franja arriba. */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={t("workspacesPage.searchPlaceholder")}
            className="w-48"
          />
          <LifecycleFilter
            value={tab}
            activeValue="ACTIVE"
            onValueChange={onTabChange}
            options={lifecycleOptions}
          />
          <SortControl
            field={sort}
            order={order}
            options={sortOptions}
            isDefault={sortIsDefault}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {workspaces.data.length === 0 && (
            <EmptyState
              icon={ICONS.workspace}
              title={t("workspacesPage.noWorkspacesFound")}
              description={t("workspacesPage.noWorkspacesFoundDescription")}
            />
          )}

          {workspaces.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>{t("workspacesPage.columns.workspace")}</TableHead>
                  <TableHead>{t("workspacesPage.columns.slug")}</TableHead>
                  <TableHead>{t("workspacesPage.columns.owners")}</TableHead>
                  <TableHead>{t("workspacesPage.columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.data.map((workspace) =>
                  showingInactive ? (
                    <InactiveWorkspaceRow key={workspace.id} workspace={workspace} />
                  ) : (
                    <ActiveWorkspaceRow key={workspace.id} workspace={workspace} />
                  ),
                )}
              </TableBody>
            </Table>
          )}

          {workspaces.data.length > 0 && (
            <ListFooter
              limit={limit}
              pageSizeOptions={pageSizeOptions}
              onLimitChange={onLimitChange}
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
