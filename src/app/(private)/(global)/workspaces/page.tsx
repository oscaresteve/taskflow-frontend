"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, MoreHorizontal, Plus, SearchIcon, Settings, ShieldMinus, Users } from "lucide-react";
import { getActiveWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PageContainer } from "@/components/page-container";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { getInitials } from "@/lib/utils";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

const MAX_VISIBLE_OWNERS = 4;

function matchesSearch(workspace: WorkspaceResponseDto, search: string) {
  if (!search) return true;
  const query = search.toLowerCase();
  return workspace.name.toLowerCase().includes(query) || workspace.slug.toLowerCase().includes(query);
}

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

function WorkspaceRow({ workspace, currentUserId }: { workspace: WorkspaceResponseDto; currentUserId?: string }) {
  const { data: members, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspace.slug));

  const owners = members?.data.filter((member) => member.role === "OWNER" && member.status === "ACTIVE") ?? [];
  const visibleOwners = owners.slice(0, MAX_VISIBLE_OWNERS);
  const remainingOwners = owners.length - visibleOwners.length;

  const myRole = members?.data.find((member) => member.userId === currentUserId)?.role;
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
  const { data: workspaces, isLoading, isError } = useQuery(getActiveWorkspacesQuery());
  const { data: me } = useQuery(getMeQuery());
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const filtered = workspaces.data.filter((workspace) => matchesSearch(workspace, search));

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Manage workspaces</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New workspace
        </Button>
      </div>

      <div className="flex justify-end">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search workspaces"
            className="w-48 pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
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
            {filtered.map((workspace) => (
              <WorkspaceRow key={workspace.id} workspace={workspace} currentUserId={me?.id} />
            ))}
          </TableBody>
        </Table>
      )}

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
