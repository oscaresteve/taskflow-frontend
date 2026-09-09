"use client";

import { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/role-labels";
import { getFullName, getInitials } from "@/lib/utils";
import { RoleBadge, RoleSelectItemContent } from "@/components/members/role-badge";
import { useFormatter, useTranslations } from "next-intl";

interface MemberLike {
  id: string;
  role: MemberRole;
  joinedAt: string | null;
  user: { id: string; firstName: string; lastName: string; email: string; avatarUrl: string | null };
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
  const t = useTranslations("members");
  const format = useFormatter();

  if (members.length === 0) {
    return <p className="px-1 py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("membersTable.columnName")}</TableHead>
          <TableHead>{t("membersTable.columnEmail")}</TableHead>
          <TableHead>{t("membersTable.columnJoined")}</TableHead>
          <TableHead>{t("membersTable.columnRole")}</TableHead>
          <TableHead>{t("membersTable.columnActions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const actions = renderActions(member);
          const isActor = actorUserId === member.user.id;
          const memberName = getFullName(member.user.firstName, member.user.lastName);
          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage src={member.user.avatarUrl ?? undefined} alt={memberName} />
                    <AvatarFallback>{getInitials(memberName)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">
                    {memberName}
                    {isActor && t("membersTable.youSuffix")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{member.user.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {member.joinedAt ? format.dateTime(new Date(member.joinedAt), "short") : t("membersTable.noJoinDate")}
              </TableCell>
              <TableCell>
                {roleChangeable(member) ? (
                  <Select value={member.role} onValueChange={(role) => onChangeRole(member, role as MemberRole)}>
                    <SelectTrigger className="border-transparent bg-transparent! p-0 ring-0! border-0">
                      <SelectValue>{(role: MemberRole) => <RoleBadge role={role} />}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-64">
                      {assignableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          <RoleSelectItemContent role={role} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <RoleBadge role={member.role} />
                )}
              </TableCell>
              <TableCell>
                {actions ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                      <MoreHorizontal />
                      <span className="sr-only">{t("membersTable.actionsSrOnly")}</span>
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
