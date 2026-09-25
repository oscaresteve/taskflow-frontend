"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumIconBadge } from "@/components/common/enum-display";
import { UserPopup } from "@/components/common/user-popup";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { OverviewTaskDto } from "@/lib/dtos/overview.dto";
import { getDueDateOption, priorityOptions, statusOptions } from "@/lib/task-enums";
import { ICONS } from "@/lib/icons";
import { getFullName, isOverdue } from "@/lib/utils";

interface TaskItemProps {
  task: OverviewTaskDto;
  href: string;
  showProject?: boolean;
}

export function TaskItem({ task, href, showProject }: TaskItemProps) {
  const t = useTranslations("tasks");
  const tEnum = useTranslations();
  const format = useFormatter();

  const statusOption = statusOptions[task.status];
  const priorityOption = priorityOptions[task.priority];

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const dueDateOption = getDueDateOption(taskIsOverdue);

  const assigneeName = task.assignee ? getFullName(task.assignee.firstName, task.assignee.lastName) : null;

  return (
    <Link href={href} className="flex items-center gap-2.5 px-2 py-2 transition-colors hover:bg-muted/50">
      <span className="shrink-0 font-mono text-xs text-muted-foreground">
        {task.project.key}-{task.taskNumber}
      </span>

      <span className="truncate text-sm font-medium">{task.title}</span>
      {showProject && <span className="max-w-32 truncate text-muted-foreground">{task.project.name}</span>}

      {/* La fila entera es un enlace, asi que el trigger del tooltip es un span y no el boton que
          Base UI pinta por defecto: un boton dentro del enlace se comeria la navegacion. */}
      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <Tooltip>
          <TooltipTrigger render={<span className="flex" />}>
            <EnumIconBadge option={statusOption} />
          </TooltipTrigger>
          <TooltipContent>{`${t("fields.status")}: ${tEnum(statusOption.labelKey)}`}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<span className="flex" />}>
            <EnumIconBadge option={priorityOption} />
          </TooltipTrigger>
          <TooltipContent>{`${t("fields.priority")}: ${tEnum(priorityOption.labelKey)}`}</TooltipContent>
        </Tooltip>

        {task.dueDate && (
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <EnumIconBadge option={dueDateOption} />
            </TooltipTrigger>
            <TooltipContent>{`${t("fields.dueDate")}: ${format.dateTime(new Date(task.dueDate), "short")}`}</TooltipContent>
          </Tooltip>
        )}

        {task.assignee && assigneeName ? (
          <Tooltip>
            <UserPopup
              userId={task.assignee.id}
              align="end"
              render={
                <TooltipTrigger
                  render={
                    <CustomAvatar
                      size="sm"
                      avatarUrl={task.assignee.avatarUrl}
                      alt={assigneeName}
                      seed={task.assignee.id}
                      variant="glyphs"
                      className="cursor-pointer"
                    />
                  }
                />
              }
            />
            <TooltipContent>{`${t("fields.assignee")}: ${assigneeName}`}</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger render={<span className="flex" />}>
              <Avatar size="sm">
                <AvatarFallback>
                  <ICONS.person className="size-4" />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{t("fields.unassigned")}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Link>
  );
}
