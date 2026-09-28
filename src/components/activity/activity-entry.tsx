"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumBadge } from "@/components/common/enum-display";
import { getProjectMemberQuery } from "@/lib/queries/project-member.queries";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { roleOptions } from "@/lib/member-enums";
import { getFullName } from "@/lib/utils";
import { ICONS } from "@/lib/icons";

// Solo algunas acciones hablan de un tercero. El resto no necesita resolver ningun nombre, y el
// del actor viaja ya en el propio evento.
function getTargetUserId(event: ActivityEventResponseDto): string | null {
  switch (event.action) {
    case "TASK_ASSIGNEE_CHANGED":
      return event.payload.to;
    case "PROJECT_MEMBER_ADDED":
    case "PROJECT_MEMBER_ROLE_CHANGED":
    case "PROJECT_MEMBER_DEACTIVATED":
      return event.payload.targetUserId;
    default:
      return null;
  }
}

export function getTaskRef(event: ActivityEventResponseDto): { taskNumber: number; taskTitle: string } | null {
  switch (event.action) {
    case "PROJECT_MEMBER_ADDED":
    case "PROJECT_MEMBER_ROLE_CHANGED":
    case "PROJECT_MEMBER_DEACTIVATED":
      return null;
    default:
      return { taskNumber: event.payload.taskNumber, taskTitle: event.payload.taskTitle };
  }
}

interface ActivityEntryProps {
  event: ActivityEventResponseDto;
  workspaceSlug: string;
  projectSlug: string;
  // El feed de una tarea ya sabe de cual habla; el del proyecto tiene que nombrarla y enlazarla.
  taskHref?: string;
  projectKey: string;
}

export function ActivityEntry({ event, workspaceSlug, projectSlug, taskHref, projectKey }: ActivityEntryProps) {
  const t = useTranslations("activity");
  const format = useFormatter();

  const targetUserId = getTargetUserId(event);
  const { data: target } = useQuery(getProjectMemberQuery({ workspaceSlug, projectSlug, userId: targetUserId }));

  const name = target ? getFullName(target.user.firstName, target.user.lastName) : t("unknownMember");
  const actorName = getFullName(event.actor.firstName, event.actor.lastName);
  const taskRef = getTaskRef(event);

  // La frase sale del catalogo de mensajes y los valores del enum se pintan con la misma insignia
  // que el resto de la app, en vez de interpolarlos como texto suelto.
  function describe(): { text: string; detail?: ReactNode } {
    switch (event.action) {
      case "TASK_CREATED":
        return { text: t("actions.TASK_CREATED") };

      case "TASK_EDITED": {
        const { fields } = event.payload;

        if (fields.length === 2) return { text: t("actions.TASK_EDITED_both") };
        if (fields[0] === "title") return { text: t("actions.TASK_EDITED_title") };

        return { text: t("actions.TASK_EDITED_description") };
      }

      case "TASK_STATUS_CHANGED":
        return {
          text: t("actions.TASK_STATUS_CHANGED"),
          detail: (
            <span className="flex items-center gap-1.5">
              <EnumBadge option={statusOptions[event.payload.from]} />
              <ICONS.chevronRight className="size-3 text-muted-foreground" />
              <EnumBadge option={statusOptions[event.payload.to]} />
            </span>
          ),
        };

      case "TASK_PRIORITY_CHANGED":
        return {
          text: t("actions.TASK_PRIORITY_CHANGED"),
          detail: (
            <span className="flex items-center gap-1.5">
              <EnumBadge option={priorityOptions[event.payload.from]} />
              <ICONS.chevronRight className="size-3 text-muted-foreground" />
              <EnumBadge option={priorityOptions[event.payload.to]} />
            </span>
          ),
        };

      case "TASK_ASSIGNEE_CHANGED":
        return event.payload.to === null
          ? { text: t("actions.TASK_ASSIGNEE_CLEARED") }
          : { text: t("actions.TASK_ASSIGNEE_ASSIGNED", { name }) };

      case "TASK_DUE_DATE_CHANGED":
        return event.payload.to === null
          ? { text: t("actions.TASK_DUE_DATE_CLEARED") }
          : {
              text: t("actions.TASK_DUE_DATE_SET", {
                date: format.dateTime(new Date(event.payload.to), "short"),
              }),
            };

      case "TASK_ARCHIVED":
        return { text: t("actions.TASK_ARCHIVED") };

      case "COMMENT_CREATED":
        return { text: t("actions.COMMENT_CREATED") };

      case "PROJECT_MEMBER_ADDED":
        return { text: t("actions.PROJECT_MEMBER_ADDED", { name }) };

      case "PROJECT_MEMBER_ROLE_CHANGED":
        return {
          text: t("actions.PROJECT_MEMBER_ROLE_CHANGED", { name }),
          detail: (
            <span className="flex items-center gap-1.5">
              <EnumBadge option={roleOptions[event.payload.from]} />
              <ICONS.chevronRight className="size-3 text-muted-foreground" />
              <EnumBadge option={roleOptions[event.payload.to]} />
            </span>
          ),
        };

      case "PROJECT_MEMBER_DEACTIVATED":
        return { text: t("actions.PROJECT_MEMBER_DEACTIVATED", { name }) };
    }
  }

  const { text, detail } = describe();

  return (
    <div className="flex items-start gap-3 py-2">
      <CustomAvatar
        size="sm"
        avatarUrl={event.actor.avatarUrl}
        alt={actorName}
        seed={event.actor.id}
        variant="glyphs"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm">
          <span className="font-medium">{actorName}</span>{" "}
          <span className="text-muted-foreground">{text}</span>
        </p>

        {detail}

        {taskHref && taskRef && (
          <Link href={taskHref} className="truncate text-xs text-muted-foreground hover:text-foreground">
            {projectKey}-{taskRef.taskNumber} · {taskRef.taskTitle}
          </Link>
        )}
      </div>

      <time dateTime={event.createdAt} className="shrink-0 text-xs text-muted-foreground">
        {format.relativeTime(new Date(event.createdAt), new Date())}
      </time>
    </div>
  );
}
