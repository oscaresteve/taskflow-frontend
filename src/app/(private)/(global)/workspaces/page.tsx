"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExternalLink, MoreHorizontal, Plus, SearchIcon, Settings, ShieldMinus, Users, XIcon } from "lucide-react";
import { getActiveWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SortControls } from "@/components/common/sort-controls";
import { SortOrder } from "@/lib/dtos/pagination.dto";
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
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PageContainer } from "@/components/common/page-container";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { getInitials } from "@/lib/utils";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

const MAX_VISIBLE_OWNERS = 4;
const PAGE_SIZE_OPTIONS = [5, 10, 15];

type WorkspaceSortField = "name" | "createdAt" | "updatedAt";

const SORT_OPTIONS: { value: WorkspaceSortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
];

function WorkspaceActionsMenu({ workspace, canManage }: { workspace: WorkspaceResponseDto; canManage: boolean }) {
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const deactivateWorkspace = useDeactivateWorkspace(workspace.slug);

  async function handleDeactivate() {
    try {
      await deactivateWorkspace.mutateAsync();
      setDeactivateOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontal />
          <span className="sr-only">Workspace actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}`} />}>
            <ExternalLink />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/members`} />}>
            <Users />
            Members
          </DropdownMenuItem>
          {canManage && (
            <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/settings`} />}>
              <Settings />
              Settings
            </DropdownMenuItem>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeactivateOpen(true)}>
                <ShieldMinus />
                Deactivate
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={`Deactivate ${workspace.name}?`}
        description="This will deactivate the workspace and hide it from all members. This action cannot be undone from the app."
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleDeactivate}
        pending={deactivateWorkspace.isPending}
        Icon={ShieldMinus}
      />
    </>
  );
}

function WorkspaceRow({ workspace }: { workspace: WorkspaceResponseDto }) {
  const { data: members, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspace.slug));
  const { role: myRole } = useWorkspaceRole(workspace.slug);

  const owners = members?.data.filter((member) => member.role === "OWNER" && member.status === "ACTIVE") ?? [];
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
            {visibleOwners.map((owner) => (
              <Avatar key={owner.id} size="sm">
                <AvatarImage src={owner.user.avatarUrl ?? undefined} alt={owner.user.name} />
                <AvatarFallback>{getInitials(owner.user.name)}</AvatarFallback>
              </Avatar>
            ))}
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
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<WorkspaceSortField>("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const {
    data: workspaces,
    isLoading,
    isError,
  } = useQuery({
    ...getActiveWorkspacesQuery({ page, search: search || undefined, limit, sort, order }),
    placeholderData: keepPreviousData,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSortFieldChange(value: WorkspaceSortField) {
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

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load workspaces.</p>;
  }

  if (isLoading || !workspaces) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const { pages: totalPages } = workspaces.pagination;

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Manage workspaces</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New workspace
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search workspaces"
            className="w-48 pl-8 pr-7"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => handleSearchChange("")}
            >
              <XIcon className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
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

      {workspaces.data.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">No workspaces found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Owners</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.data.map((workspace) => (
              <WorkspaceRow key={workspace.id} workspace={workspace} />
            ))}
          </TableBody>
        </Table>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
