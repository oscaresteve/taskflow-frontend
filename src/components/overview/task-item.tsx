"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumIconBadge } from "@/components/common/enum-display";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { neutralColors, severityCriticalColors } from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";
import { OverviewTaskDto } from "@/lib/dtos/overview.dto";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { ICONS } from "@/lib/icons";
import { getFullName, isOverdue } from "@/lib/utils";

interface TaskItemProps {
  task: OverviewTaskDto;
  href: string;
  showProject?: boolean;
}

// La fila es de solo lectura, asi que la fecha limite se pinta con el mismo lenguaje de icono que
// el estado y la prioridad (badge + tooltip) en vez de con los tres estados del date picker.
function getDueDateOption(dueDate: string | null, overdue: boolean): EnumOption {
  if (!dueDate) return { labelKey: "tasks.fields.noDueDate", icon: ICONS.dueDateEmpty, colors: neutralColors };
  if (overdue) return { labelKey: "tasks.fields.dueDate", icon: ICONS.overdue, colors: severityCriticalColors };

  return { labelKey: "tasks.fields.dueDate", icon: ICONS.dueDate, colors: neutralColors };
}

export function TaskItem({ task, href, showProject }: TaskItemProps) {
  const t = useTranslations("tasks");
  const tEnum = useTranslations();
  const format = useFormatter();

  const statusOption = statusOptions[task.status];
  const priorityOption = priorityOptions[task.priority];

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const dueDateOption = getDueDateOption(task.dueDate, taskIsOverdue);
  const dueDateLabel = task.dueDate
    ? `${t("fields.dueDate")}: ${format.dateTime(new Date(task.dueDate), "short")}`
    : t("fields.noDueDate");

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

        <Tooltip>
          <TooltipTrigger render={<span className="flex" />}>
            <EnumIconBadge option={dueDateOption} />
          </TooltipTrigger>
          <TooltipContent>{dueDateLabel}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<span className="flex" />}>
            {task.assignee && assigneeName ? (
              <CustomAvatar
                size="sm"
                avatarUrl={task.assignee.avatarUrl}
                alt={assigneeName}
                seed={task.assignee.id}
                variant="glyphs"
              />
            ) : (
              <Avatar size="sm">
                <AvatarFallback>
                  <ICONS.person className="size-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {assigneeName ? `${t("fields.assignee")}: ${assigneeName}` : t("fields.unassigned")}
          </TooltipContent>
        </Tooltip>
      </div>
    </Link>
  );
}
