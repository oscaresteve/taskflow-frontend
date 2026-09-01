"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, UserX } from "lucide-react";
import { getProjectMembersPageQuery, getProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSizeSelect } from "@/components/page-size-select";
import { PaginationControls } from "@/components/pagination-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { AddProjectMemberDialog } from "@/components/add-project-member-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MembersFilterBar } from "@/components/members-filter-bar";
import { MembersTable } from "@/components/members-table";
import { PageContainer } from "@/components/page-container";
import { useUpdateProjectMember } from "@/hooks/use-update-project-member";
import { useDeactivateProjectMember } from "@/hooks/use-deactivate-project-member";
import { ApiError } from "@/lib/http/api-error";
import { ProjectMemberWithUserResponseDto, ProjectRole } from "@/lib/dtos/project-members.dto";
import { RoleFilter, matchesMemberFilters } from "@/lib/member-role-filter";
import {
  assignableProjectRoles,
  canDeactivateProjectMember,
  canUpdateProjectMemberRole,
  isProjectManager,
} from "@/lib/permissions/project-member-permissions";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

export default function ProjectMembersPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: me } = useQuery(getMeQuery());
  // Unpaginated lookup, kept separate from the tables below so that permission checks (myRole)
  // don't depend on which page of which tab happens to be loaded.
  const { data: allMembers } = useQuery(getProjectMembersQuery({ workspaceSlug, projectSlug }));
  const updateProjectMember = useUpdateProjectMember(workspaceSlug, projectSlug);
  const deactivateProjectMember = useDeactivateProjectMember(workspaceSlug, projectSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [memberToDeactivate, setMemberToDeactivate] = useState<ProjectMemberWithUserResponseDto | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [limit, setLimit] = useState(PAGE_SIZE_OPTIONS[0]);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const activeQuery = useQuery(
    getProjectMembersPageQuery({ workspaceSlug, projectSlug, isActive: [true], page: activePage, limit }),
  );
  const inactiveQuery = useQuery(
    getProjectMembersPageQuery({ workspaceSlug, projectSlug, isActive: [false], page: inactivePage, limit }),
  );

  function handleLimitChange(value: number) {
    setLimit(value);
    setActivePage(1);
    setInactivePage(1);
  }

  if (activeQuery.isError || inactiveQuery.isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (!activeQuery.data || !inactiveQuery.data) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </PageContainer>
    );
  }

  const myRole = allMembers?.data.find((member) => member.userId === me?.id)?.role;
  const assignableRoles = assignableProjectRoles(myRole);

  const activeMembers = activeQuery.data.data.filter((member) => matchesMemberFilters(member, search, roleFilter));
  const inactiveMembers = inactiveQuery.data.data.filter((member) =>
    matchesMemberFilters(member, search, roleFilter),
  );

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleChangeRole(member: ProjectMemberWithUserResponseDto, role: ProjectRole) {
    if (role === member.role) return;
    updateProjectMember.mutate({ userId: member.userId, data: { role } }, { onError: reportError });
  }

  function handleRequestDeactivate(member: ProjectMemberWithUserResponseDto) {
    setMemberToDeactivate(member);
    setDeactivateDialogOpen(true);
  }

  function handleConfirmDeactivate() {
    if (!memberToDeactivate) return;
    deactivateProjectMember.mutate(memberToDeactivate.userId, {
      onSuccess: () => setDeactivateDialogOpen(false),
      onError: reportError,
    });
  }

  function roleChangeable(member: ProjectMemberWithUserResponseDto) {
    return canUpdateProjectMemberRole({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });
  }

  function renderActions(member: ProjectMemberWithUserResponseDto) {
    const deactivatable = canDeactivateProjectMember({
      actorUserId: me?.id,
      actorRole: myRole,
      targetUserId: member.userId,
      targetRole: member.role,
      targetIsActive: member.isActive,
    });

    return deactivatable ? (
      <Button
        variant="link"
        className="h-auto p-0 text-sm text-destructive"
        onClick={() => handleRequestDeactivate(member)}
      >
        Deactivate
      </Button>
    ) : null;
  }

  return (
    <PageContainer className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Members</h1>
        {isProjectManager(myRole) ? (
          <Button size="sm" onClick={() => setAddMemberOpen(true)}>
            <UserPlus />
            Add member
          </Button>
        ) : null}
      </div>

      <Tabs defaultValue="active">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="active">
              Current members
              <Badge variant="secondary">{activeQuery.data.pagination.total}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Inactive
              <Badge variant="secondary">{inactiveQuery.data.pagination.total}</Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <MembersFilterBar
              search={search}
              onSearchChange={setSearch}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
            />
            <PageSizeSelect value={limit} options={PAGE_SIZE_OPTIONS} onChange={handleLimitChange} />
          </div>
        </div>

        <TabsContent value="active" className="flex flex-col gap-4">
          <MembersTable
            members={activeMembers}
            assignableRoles={assignableRoles}
            roleChangeable={roleChangeable}
            onChangeRole={handleChangeRole}
            renderActions={renderActions}
            emptyMessage="No members found."
          />
          <PaginationControls
            page={activePage}
            totalPages={activeQuery.data.pagination.pages}
            onPageChange={setActivePage}
          />
        </TabsContent>
        <TabsContent value="inactive" className="flex flex-col gap-4">
          <MembersTable
            members={inactiveMembers}
            assignableRoles={assignableRoles}
            roleChangeable={roleChangeable}
            onChangeRole={handleChangeRole}
            renderActions={renderActions}
            emptyMessage="No inactive members."
          />
          <PaginationControls
            page={inactivePage}
            totalPages={inactiveQuery.data.pagination.pages}
            onPageChange={setInactivePage}
          />
        </TabsContent>
      </Tabs>

      <AddProjectMemberDialog
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
      />
      <ConfirmDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        title="Deactivate member"
        description={`Deactivate ${memberToDeactivate?.user.name} on this project? They'll lose access to it immediately.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleConfirmDeactivate}
        pending={deactivateProjectMember.isPending}
        Icon={UserX}
      />
    </PageContainer>
  );
}
