"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ICONS, type Icon } from "@/lib/icons";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { OwnersCell } from "@/components/members/owners-cell";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceActionsMenu } from "@/components/workspaces/workspace-actions-menu";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { WorkspaceListItemResponseDto } from "@/lib/dtos/workspaces.dto";
import { WorkspaceLifecycle, WorkspaceSortField, workspaceLifecycles } from "@/lib/workspace-enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  const LIFECYCLE_TABS: { value: WorkspaceLifecycle; label: string; icon: Icon }[] = [
    { value: "ACTIVE", label: t("workspacesPage.lifecycle.active"), icon: ICONS.workspace },
    { value: "INACTIVE", label: t("workspacesPage.lifecycle.inactive"), icon: ICONS.deactivate },
  ];
  const sortOptions: { value: WorkspaceSortField; label: string }[] = [
    { value: "name", label: t("workspacesPage.sort.name") },
    { value: "createdAt", label: t("workspacesPage.sort.createdAt") },
    { value: "updatedAt", label: t("workspacesPage.sort.updatedAt") },
  ];

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
  } = useWorkspacesTable();
  const { tab, onTabChange } = useTabParam(workspaceLifecycles, "ACTIVE");

  const showingInactive = tab === "INACTIVE";

  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    ...getWorkspacesQuery({ page, search: searchParam, limit, sort, order, isActive: !showingInactive }),
    placeholderData: keepPreviousData,
  });

  // Un contador por pestana, igual que en miembros: la propia busqueda los acota, para que el numero
  // cuadre con lo que la tabla ensena debajo.
  const activeCountQuery = useQuery(
    getWorkspacesQuery({ page: 1, limit: 1, search: searchParam, isActive: true }),
  );
  const inactiveCountQuery = useQuery(
    getWorkspacesQuery({ page: 1, limit: 1, search: searchParam, isActive: false }),
  );
  const countQueryByTab = {
    ACTIVE: activeCountQuery,
    INACTIVE: inactiveCountQuery,
  };

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
    <PageContainer>
      <PageHeader
        title={t("workspacesPage.title")}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <ICONS.addNew />
            {t("workspacesPage.newWorkspace")}
          </Button>
        }
      />

      <Tabs className="gap-4" value={tab} onValueChange={(value) => onTabChange(value as WorkspaceLifecycle)}>
        <div className="border-b">
          <TabsList variant="line">
            {LIFECYCLE_TABS.map((lifecycleTab) => {
              const total = countQueryByTab[lifecycleTab.value].data?.pagination.total;
              return (
                <TabsTrigger key={lifecycleTab.value} value={lifecycleTab.value}>
                  <lifecycleTab.icon />
                  {lifecycleTab.label}
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
            placeholder={t("workspacesPage.searchPlaceholder")}
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

        {LIFECYCLE_TABS.map((lifecycleTab) => (
          <TabsContent key={lifecycleTab.value} value={lifecycleTab.value} className="flex flex-col gap-4">
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
              <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
