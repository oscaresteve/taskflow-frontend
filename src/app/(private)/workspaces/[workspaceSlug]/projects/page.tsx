"use client";

import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SearchInput } from "@/components/common/search-input";
import { SortControls } from "@/components/common/sort-controls";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

import { Archive, ExternalLink, MoreHorizontal, Plus, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SortOrder } from "@/lib/dtos/pagination.dto";
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
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { ColorDot } from "@/components/ui/color-dot";
import { formatDate, getInitials } from "@/lib/utils";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { useArchiveProject } from "@/hooks/use-archive-project";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MAX_VISIBLE_OWNERS = 4;
const PAGE_SIZE_OPTIONS = [5, 10, 15];

type ProjectSortField = "name" | "createdAt" | "updatedAt";

const SORT_OPTIONS: { value: ProjectSortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "createdAt", label: "Created" },
  { value: "updatedAt", label: "Updated" },
];

function ProjectActionsMenu({
  workspaceSlug,
  project,
  canManage,
}: {
  workspaceSlug: string;
  project: ProjectResponseDto;
  canManage: boolean;
}) {
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archiveProject = useArchiveProject(workspaceSlug, project.slug);

  async function handleArchive() {
    try {
      await archiveProject.mutateAsync();
      setArchiveOpen(false);
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
          <span className="sr-only">Project actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`} />}>
            <ExternalLink />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}/members`} />}>
            <Users />
            Members
          </DropdownMenuItem>
          {canManage && (
            <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}/settings`} />}>
              <Settings />
              Settings
            </DropdownMenuItem>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setArchiveOpen(true)}>
                <Archive />
                Archive
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={`Archive ${project.name}?`}
        description="This will archive the project and hide it from all members. This action cannot be undone from the app."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveProject.isPending}
        Icon={Archive}
      />
    </>
  );
}

function ProjectRow({ workspaceSlug, project }: { workspaceSlug: string; project: ProjectResponseDto }) {
  const {
    data: members,
    isLoading,
    isError,
  } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug: project.slug }));
  const { role: myRole } = useProjectRole(workspaceSlug, project.slug);

  const owners = members?.data.filter((member) => member.role === "OWNER") ?? [];
  const visibleOwners = owners.slice(0, MAX_VISIBLE_OWNERS);
  const remainingOwners = owners.length - visibleOwners.length;

  const canManage = isProjectManager(myRole);

  return (
    <TableRow>
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
      <TableCell className="text-muted-foreground">{formatDate(project.createdAt)}</TableCell>
      <TableCell>
        <ProjectActionsMenu workspaceSlug={workspaceSlug} project={project} canManage={canManage} />
      </TableCell>
    </TableRow>
  );
}

export default function ProjectsPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { role: myWorkspaceRole } = useWorkspaceRole(workspaceSlug);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<ProjectSortField>("name");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    ...getProjectsQuery(workspaceSlug, { page, search: search || undefined, limit, sort, order }),
    placeholderData: keepPreviousData,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSortFieldChange(value: ProjectSortField) {
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
    return <p className="p-6 text-sm text-muted-foreground">Failed to load projects.</p>;
  }

  if (isLoading || !projects) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const { pages: totalPages } = projects.pagination;

  return (
    <PageContainer className="flex flex-col gap-4">
      <PageHeader
        title="Manage projects"
        actions={
          isWorkspaceManager(myWorkspaceRole) ? (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus />
              New project
            </Button>
          ) : null
        }
      />

      <div className="flex items-center justify-between gap-2">
        <SearchInput value={search} onChange={handleSearchChange} placeholder="Search projects" className="w-48" />
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

      {projects.data.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">No projects found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Owners</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.data.map((project) => (
              <ProjectRow key={project.id} workspaceSlug={workspaceSlug} project={project} />
            ))}
          </TableBody>
        </Table>
      )}

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />

      <CreateProjectDialog open={createOpen} workspaceSlug={workspaceSlug} onOpenChange={setCreateOpen} />
    </PageContainer>
  );
}
