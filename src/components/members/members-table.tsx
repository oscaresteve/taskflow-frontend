"use client";

import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/member-role-filter";
import { formatDate, getInitials } from "@/lib/utils";

interface MemberLike {
  id: string;
  role: MemberRole;
  joinedAt: string | null;
  user: { id: string; name: string; email: string; avatarUrl: string | null };
}

export function MembersTable<TMember extends MemberLike>({
  members,
  assignableRoles,
  roleChangeable,
  onChangeRole,
  renderActions,
  emptyMessage,
  actorUserId,
}: {
  members: TMember[];
  assignableRoles: MemberRole[];
  roleChangeable: (member: TMember) => boolean;
  onChangeRole: (member: TMember, role: MemberRole) => void;
  renderActions: (member: TMember) => ReactNode | null;
  emptyMessage: string;
  actorUserId?: string;
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
          <TableHead>Joined</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const actions = renderActions(member);
          const isActor = actorUserId === member.user.id;
          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.name} />
                    <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">
                    {member.user.name}
                    {isActor && " (You)"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{member.user.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {member.joinedAt ? formatDate(member.joinedAt) : "—"}
              </TableCell>
              <TableCell>
                {roleChangeable(member) ? (
                  <Select value={member.role} onValueChange={(role) => onChangeRole(member, role as MemberRole)}>
                    <SelectTrigger
                      size="sm"
                      className="h-auto border-transparent bg-transparent px-1 py-0.5 shadow-none"
                    >
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
                {actions ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal />
                      <span className="sr-only">Member actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">{actions}</DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
