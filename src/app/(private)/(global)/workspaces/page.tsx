"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ICONS } from "@/lib/icons";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/search-input";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { getFullName, getInitials } from "@/lib/utils";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceSortField } from "@/lib/workspace-enums";
import { useWorkspacesTable } from "@/hooks/use-workspaces-table";

const MAX_VISIBLE_OWNERS = 4;

function WorkspaceActionsMenu({ workspace, canManage }: { workspace: WorkspaceResponseDto; canManage: boolean }) {
  const t = useTranslations("workspaces");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const deactivateWorkspace = useDeactivateWorkspace(workspace.slug);

  async function handleDeactivate() {
    try {
      await deactivateWorkspace.mutateAsync();
      setDeactivateOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={<Button aria-label={t("workspaceActionsMenu.ariaLabel")} variant="ghost" size="icon-sm" />}
              />
            }
          >
            <ICONS.moreActions />
          </TooltipTrigger>
          <TooltipContent>{t("workspaceActionsMenu.ariaLabel")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}`} />}>
            <ICONS.openExternal />
            {t("workspaceActionsMenu.open")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/members`} />}>
            <ICONS.members />
            {t("workspaceActionsMenu.members")}
          </DropdownMenuItem>
          {canManage && (
            <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/settings`} />}>
              <ICONS.settings />
              {t("workspaceActionsMenu.settings")}
            </DropdownMenuItem>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeactivateOpen(true)}>
                <ICONS.deactivate />
                {t("workspaceActionsMenu.deactivate")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={t.rich("workspaceActionsMenu.deactivateTitle", { name: workspace.name, ...richTitleTags })}
        description={t("workspaceActionsMenu.deactivateDescription")}
        confirmLabel={t("workspaceActionsMenu.deactivateConfirmLabel")}
        variant="destructive"
        onConfirm={handleDeactivate}
        pending={deactivateWorkspace.isPending}
        Icon={ICONS.deactivate}
      />
    </>
  );
}

function WorkspaceRow({ workspace }: { workspace: WorkspaceResponseDto }) {
  const { data: members, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspace.slug));
  const { role: myRole } = useWorkspaceRole(workspace.slug);

  const owners = members?.filter((member) => member.role === "OWNER" && member.status === "ACTIVE") ?? [];
  const visibleOwners = owners.slice(0, MAX_VISIBLE_OWNERS);
  const remainingOwners = owners.length - visibleOwners.length;

  const canManage = isWorkspaceManager(myRole);

  return (
    <TableRow>
      <TableCell>
        <Link href={`/workspaces/${workspace.slug}`} className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
            <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
          </Avatar>
          <span className="truncate font-medium">{workspace.name}</span>
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground">{workspace.slug}</TableCell>
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
                <Avatar key={owner.id} size="sm">
                  <AvatarImage src={owner.user.avatarUrl ?? undefined} alt={ownerName} />
                  <AvatarFallback>{getInitials(ownerName)}</AvatarFallback>
                </Avatar>
              );
            })}
            {remainingOwners > 0 && <AvatarGroupCount>+{remainingOwners}</AvatarGroupCount>}
          </AvatarGroup>
        )}
      </TableCell>
      <TableCell>
        <WorkspaceActionsMenu workspace={workspace} canManage={canManage} />
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

  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    ...getWorkspacesQuery({ page, search: searchParam, limit, sort, order }),
    placeholderData: keepPreviousData,
  });

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

      {workspaces.data.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">{t("workspacesPage.noWorkspacesFound")}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("workspacesPage.columns.workspace")}</TableHead>
              <TableHead>{t("workspacesPage.columns.slug")}</TableHead>
              <TableHead>{t("workspacesPage.columns.owners")}</TableHead>
              <TableHead>{t("workspacesPage.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.data.map((workspace) => (
              <WorkspaceRow key={workspace.id} workspace={workspace} />
            ))}
          </TableBody>
        </Table>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
