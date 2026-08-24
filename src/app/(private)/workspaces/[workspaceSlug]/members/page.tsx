"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, UserPlus, UserX } from "lucide-react";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { getInitials } from "@/lib/utils";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActivateWorkspaceMember } from "@/hooks/use-activate-workspace-member";
import { useUpdateWorkspaceMember } from "@/hooks/use-update-workspace-member";
import { useRemoveWorkspaceMember } from "@/hooks/use-remove-workspace-member";
import { ApiError } from "@/lib/http/api-error";
import { WorkspaceMemberWithUserResponseDto, WorkspaceRole } from "@/lib/dtos/workspace-members.dto";
import {
  assignableWorkspaceRoles,
  canActivateWorkspaceMember,
  canRemoveWorkspaceMember,
  canUpdateWorkspaceMemberRole,
  isWorkspaceManager,
} from "@/lib/permissions/workspace-member-permissions";

const roleFilters = ["ALL", "OWNER", "ADMIN", "MEMBER"] as const;
type RoleFilter = (typeof roleFilters)[number];

const roleFilterLabels: Record<RoleFilter, string> = {
  ALL: "All roles",
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

function matchesFilters(member: WorkspaceMemberWithUserResponseDto, search: string, roleFilter: RoleFilter) {
  if (roleFilter !== "ALL" && member.role !== roleFilter) return false;
  if (!search) return true;
  const query = search.toLowerCase();
  return member.user.name.toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query);
}

function MemberTableRow({
  member,
  myUserId,
  myRole,
  onActivate,
  onChangeRole,
  onRequestRemove,
}: {
  member: WorkspaceMemberWithUserResponseDto;
  myUserId: string | undefined;
  myRole: WorkspaceRole | undefined;
  onActivate: (member: WorkspaceMemberWithUserResponseDto) => void;
  onChangeRole: (member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) => void;
  onRequestRemove: (member: WorkspaceMemberWithUserResponseDto) => void;
}) {
  const user = member.user;

  const activatable =
    member.status === "PENDING" && canActivateWorkspaceMember({ actorRole: myRole, targetRole: member.role });
  const roleChangeable = canUpdateWorkspaceMemberRole({
    actorUserId: myUserId,
    actorRole: myRole,
    targetUserId: member.userId,
    targetRole: member.role,
    targetStatus: member.status,
  });
  const removable = canRemoveWorkspaceMember({
    actorUserId: myUserId,
    actorRole: myRole,
    targetUserId: member.userId,
    targetRole: member.role,
    targetStatus: member.status,
  });
  const assignableRoles = assignableWorkspaceRoles(myRole);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="truncate font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell>
        {roleChangeable ? (
          <Select value={member.role} onValueChange={(role) => onChangeRole(member, role as WorkspaceRole)}>
            <SelectTrigger size="sm" className="h-auto border-transparent bg-transparent px-1 py-0.5 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assignableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="px-1 text-sm">{member.role}</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {activatable ? (
            <Button variant="link" className="h-auto p-0 text-sm" onClick={() => onActivate(member)}>
              Activate
            </Button>
          ) : null}
          {removable ? (
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-destructive"
              onClick={() => onRequestRemove(member)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

function MembersTable({
  members,
  myUserId,
  myRole,
  onActivate,
  onChangeRole,
  onRequestRemove,
  emptyMessage,
}: {
  members: WorkspaceMemberWithUserResponseDto[];
  myUserId: string | undefined;
  myRole: WorkspaceRole | undefined;
  onActivate: (member: WorkspaceMemberWithUserResponseDto) => void;
  onChangeRole: (member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) => void;
  onRequestRemove: (member: WorkspaceMemberWithUserResponseDto) => void;
  emptyMessage: string;
}) {
  if (members.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <MemberTableRow
            key={member.id}
            member={member}
            myUserId={myUserId}
            myRole={myRole}
            onActivate={onActivate}
            onChangeRole={onChangeRole}
            onRequestRemove={onRequestRemove}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export default function WorkspaceMembersPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspaceMembers, isLoading, isError } = useQuery(getWorkspaceMembersQuery(workspaceSlug));
  const { data: me } = useQuery(getMeQuery());
  const activateWorkspaceMember = useActivateWorkspaceMember(workspaceSlug);
  const updateWorkspaceMember = useUpdateWorkspaceMember(workspaceSlug);
  const removeWorkspaceMember = useRemoveWorkspaceMember(workspaceSlug);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMemberWithUserResponseDto | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">Failed to load members.</p>;
  }

  if (isLoading || !workspaceMembers) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  const myRole = workspaceMembers.data.find((member) => member.userId === me?.id)?.role;
  const filtered = workspaceMembers.data.filter((member) => matchesFilters(member, search, roleFilter));
  const activeMembers = filtered.filter((member) => member.status === "ACTIVE");
  const pendingMembers = filtered.filter((member) => member.status === "PENDING");
  const removedMembers = filtered.filter((member) => member.status === "REMOVED");

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : "Something went wrong",
      priority: "high",
    });
  }

  function handleActivate(member: WorkspaceMemberWithUserResponseDto) {
    activateWorkspaceMember.mutate(member.userId, { onError: reportError });
  }

  function handleRequestRemove(member: WorkspaceMemberWithUserResponseDto) {
    setMemberToRemove(member);
    setRemoveDialogOpen(true);
  }

  function handleConfirmRemove() {
    if (!memberToRemove) return;
    removeWorkspaceMember.mutate(memberToRemove.userId, {
      onSuccess: () => setRemoveDialogOpen(false),
      onError: reportError,
    });
  }

  function handleChangeRole(member: WorkspaceMemberWithUserResponseDto, role: WorkspaceRole) {
    if (role === member.role) return;
    updateWorkspaceMember.mutate({ userId: member.userId, data: { role } }, { onError: reportError });
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Members</h1>
        {isWorkspaceManager(myRole) ? (
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
              <Badge variant="secondary">{activeMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary">{pendingMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="removed">
              Removed
              <Badge variant="secondary">{removedMembers.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members"
                className="w-48 pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleFilters.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleFilterLabels[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active">
          <MembersTable
            members={activeMembers}
            myUserId={me?.id}
            myRole={myRole}
            onActivate={handleActivate}
            onChangeRole={handleChangeRole}
            onRequestRemove={handleRequestRemove}
            emptyMessage="No members found."
          />
        </TabsContent>
        <TabsContent value="pending">
          <MembersTable
            members={pendingMembers}
            myUserId={me?.id}
            myRole={myRole}
            onActivate={handleActivate}
            onChangeRole={handleChangeRole}
            onRequestRemove={handleRequestRemove}
            emptyMessage="No pending members."
          />
        </TabsContent>
        <TabsContent value="removed">
          <MembersTable
            members={removedMembers}
            myUserId={me?.id}
            myRole={myRole}
            onActivate={handleActivate}
            onChangeRole={handleChangeRole}
            onRequestRemove={handleRequestRemove}
            emptyMessage="No removed members."
          />
        </TabsContent>
      </Tabs>

      <AddMemberDialog workspaceSlug={workspaceSlug} open={addMemberOpen} onOpenChange={setAddMemberOpen} />
      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title="Remove member"
        description={`Remove ${memberToRemove?.user.name} from this workspace? They'll lose access immediately.`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={handleConfirmRemove}
        pending={removeWorkspaceMember.isPending}
        Icon={UserX}
      />
    </div>
  );
}
