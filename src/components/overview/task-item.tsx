"use client";

import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumBadge } from "@/components/common/enum-display";
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

  const taskIsOverdue = !!task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate);
  const assigneeName = task.assignee ? getFullName(task.assignee.firstName, task.assignee.lastName) : null;
  const hasMeta = showProject || !!task.dueDate;

  return (
    <Link
      href={href}
      className="flex items-stretch gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <span aria-hidden className={cn("w-[3px] shrink-0 rounded-full", priorityOptions[task.priority].colors.bg)} />
      <span className="sr-only">{`${t("fields.priority")}: ${t(`priority.${task.priority}`)}`}</span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {task.project.key}-{task.taskNumber}
          </span>
          <span className="truncate text-sm font-medium">{task.title}</span>
        </div>

        {hasMeta && (
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            {showProject && <span className="truncate">{task.project.name}</span>}
            {showProject && task.dueDate && <span aria-hidden>·</span>}
            {task.dueDate && (
              <span
                className={cn("flex shrink-0 items-center gap-1", taskIsOverdue && "text-severity-critical-foreground")}
              >
                {taskIsOverdue ? <ICONS.overdue className="size-3" /> : <ICONS.dueDate className="size-3" />}
                {format.dateTime(new Date(task.dueDate), "short")}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <EnumBadge option={statusOptions[task.status]} />
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
