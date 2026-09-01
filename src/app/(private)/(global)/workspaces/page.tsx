"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus, SearchIcon } from "lucide-react";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateWorkspaceDialog } from "@/components/create-workspace-dialog";
import { PageContainer } from "@/components/page-container";
import { getInitials } from "@/lib/utils";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

function matchesSearch(workspace: WorkspaceResponseDto, search: string) {
  if (!search) return true;
  const query = search.toLowerCase();
  return workspace.name.toLowerCase().includes(query) || workspace.slug.toLowerCase().includes(query);
}

function WorkspacesTable({ workspaces, emptyMessage }: { workspaces: WorkspaceResponseDto[]; emptyMessage: string }) {
  if (workspaces.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workspace</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workspaces.map((workspace) => (
          <TableRow key={workspace.id}>
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
              <Link
                href={`/workspaces/${workspace.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Open
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function WorkspacesPage() {
  const { data: workspaces, isLoading, isError } = useQuery(getWorkspacesQuery());
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
  const activeWorkspaces = filtered.filter((workspace) => workspace.isActive);
  const inactiveWorkspaces = filtered.filter((workspace) => !workspace.isActive);

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Manage workspaces</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus />
          New workspace
        </Button>
      </div>

      <Tabs defaultValue="active">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="active">
              Active
              <Badge variant="secondary">{activeWorkspaces.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive
              <Badge variant="secondary">{inactiveWorkspaces.length}</Badge>
            </TabsTrigger>
          </TabsList>
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

        <TabsContent value="active">
          <WorkspacesTable workspaces={activeWorkspaces} emptyMessage="No workspaces found." />
        </TabsContent>
        <TabsContent value="inactive">
          <WorkspacesTable workspaces={inactiveWorkspaces} emptyMessage="No inactive workspaces." />
        </TabsContent>
      </Tabs>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
