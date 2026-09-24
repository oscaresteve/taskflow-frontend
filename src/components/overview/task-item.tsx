"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { OverviewTaskDto } from "@/lib/dtos/overview.dto";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { ICONS } from "@/lib/icons";
import { cn, getFullName, isOverdue } from "@/lib/utils";

interface TaskItemProps {
  task: OverviewTaskDto;
  href: string;
  showProject?: boolean;
}

export function TaskItem({ task, href, showProject }: TaskItemProps) {
  const t = useTranslations("tasks");
  const format = useFormatter();

  const statusOption = statusOptions[task.status];
  const priorityOption = priorityOptions[task.priority];
  const StatusIcon = statusOption.icon;
  const PriorityIcon = priorityOption.icon;

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const assigneeName = task.assignee ? getFullName(task.assignee.firstName, task.assignee.lastName) : null;

  return (
    <Link href={href} className="flex items-center gap-2.5 px-2 py-2 transition-colors hover:bg-muted/50">
      <StatusIcon className={cn("size-4 shrink-0", statusOption.colors.text)} />
      <span className="sr-only">{`${t("fields.status")}: ${t(`status.${task.status}`)}`}</span>

      <span className="shrink-0 font-mono text-xs text-muted-foreground">
        {task.project.key}-{task.taskNumber}
      </span>

      <span className="truncate text-sm font-medium">{task.title}</span>
      {showProject && <span className="max-w-32 truncate text-muted-foreground">{task.project.name}</span>}

      <div className="ml-auto flex shrink-0 items-center gap-2.5 text-xs text-muted-foreground">
        {task.dueDate && (
          <span className={cn("flex items-center gap-1", taskIsOverdue && "text-severity-critical-foreground")}>
            {taskIsOverdue ? <ICONS.overdue className="size-3.5" /> : <ICONS.dueDate className="size-3.5" />}
            {format.dateTime(new Date(task.dueDate), "short")}
          </span>
        )}

        <PriorityIcon className={cn("size-4", priorityOption.colors.text)} />
        <span className="sr-only">{`${t("fields.priority")}: ${t(`priority.${task.priority}`)}`}</span>

        {task.assignee && assigneeName ? (
          <CustomAvatar
            size="sm"
            avatarUrl={task.assignee.avatarUrl}
            alt={assigneeName}
            seed={task.assignee.id}
            variant="glyphs"
          />
        ) : null}
      </div>
    </Link>
  );
}
