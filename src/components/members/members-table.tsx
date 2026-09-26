"use client";

import { ReactNode } from "react";
import { ICONS } from "@/lib/icons";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { UserPopup } from "@/components/common/user-popup";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent } from "@/components/common/actions-menu";
import { MemberRole } from "@/lib/dtos/members.dto";
import { roleOptions } from "@/lib/member-enums";
import { getFullName } from "@/lib/utils";
import { EnumBadge } from "@/components/common/enum-display";
import { RoleSelect } from "@/components/members/role-select";
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
  emptyState,
  actorUserId,
}: {
  members: TMember[];
  assignableRoles: MemberRole[];
  roleChangeable: (member: TMember) => boolean;
  onChangeRole: (member: TMember, role: MemberRole) => void;
  renderActions: (member: TMember) => ReactNode | null;
  emptyState: ReactNode;
  actorUserId?: string;
}) {
  const t = useTranslations("members");
  const format = useFormatter();

  if (members.length === 0) {
    return emptyState;
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
                  <Tooltip>
                    <UserPopup
                      userId={member.user.id}
                      align="start"
                      render={
                        <TooltipTrigger
                          render={
                            <CustomAvatar
                              size="sm"
                              avatarUrl={member.user.avatarUrl}
                              alt={memberName}
                              seed={member.user.id}
                              variant="glyphs"
                              className="cursor-pointer"
                            />
                          }
                        />
                      }
                    />
                    <TooltipContent>{memberName}</TooltipContent>
                  </Tooltip>
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
                  <RoleSelect
                    value={member.role}
                    variant="badge"
                    values={assignableRoles}
                    onValueChange={(role) => onChangeRole(member, role)}
                  />
                ) : (
                  <EnumBadge option={roleOptions[member.role]} />
                )}
              </TableCell>
              <TableCell>
                {actions ? (
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon-sm" aria-label={t("membersTable.actionsSrOnly")} />
                            }
                          />
                        }
                      >
                        <ICONS.moreActions />
                      </TooltipTrigger>
                      <TooltipContent>{t("membersTable.actionsSrOnly")}</TooltipContent>
                    </Tooltip>
                    <ActionsMenuContent align="end">{actions}</ActionsMenuContent>
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
