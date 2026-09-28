"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumBadge } from "@/components/common/enum-display";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { priorityOptions, statusOptions } from "@/lib/task-enums";
import { roleOptions } from "@/lib/member-enums";
import { getFullName } from "@/lib/utils";
import { ICONS } from "@/lib/icons";

// Las acciones que hablan de una tarea son las unicas que enlazan a una. El resto cuelga del
// proyecto o del propio espacio.
export function getTaskRef(event: ActivityEventResponseDto): { taskNumber: number; taskTitle: string } | null {
  switch (event.action) {
    case "TASK_CREATED":
    case "TASK_EDITED":
    case "TASK_STATUS_CHANGED":
    case "TASK_PRIORITY_CHANGED":
    case "TASK_ASSIGNEE_CHANGED":
    case "TASK_DUE_DATE_CHANGED":
    case "TASK_ARCHIVED":
    case "COMMENT_CREATED":
    case "COMMENT_EDITED":
    case "COMMENT_DELETED":
      return { taskNumber: event.payload.taskNumber, taskTitle: event.payload.taskTitle };
    default:
      return null;
  }
}

interface ActivityEntryProps {
  event: ActivityEventResponseDto;
  // El feed de una tarea ya sabe de cual habla; los otros dos tienen que nombrarla y enlazarla.
  taskHref?: string;
}

export function ActivityEntry({ event, taskHref }: ActivityEntryProps) {
  const t = useTranslations("activity");
  const format = useFormatter();

  // El evento trae ya resuelta a la persona de la que habla, asi que la frase no depende de tener
  // a mano el roster del proyecto: la campanita cruza espacios y no lo tendria.
  const name = event.target ? getFullName(event.target.firstName, event.target.lastName) : t("unknownMember");
  const actorName = getFullName(event.actor.firstName, event.actor.lastName);
  const taskRef = getTaskRef(event);

  function transition(from: ReactNode, to: ReactNode) {
    return (
      <span className="flex items-center gap-1.5">
        {from}
        <ICONS.chevronRight className="size-3 text-muted-foreground" />
        {to}
      </span>
    );
  }

  // Los campos sin narrativa propia se listan con el separador del idioma, asi que añadir uno
  // nuevo no obliga a escribir una frase nueva.
  function listFields(fields: readonly string[]): string {
    return format.list(fields.map((field) => t(`fields.${field}`))) as string;
  }

  // La frase sale del catalogo de mensajes y los valores del enum se pintan con la misma insignia
  // que el resto de la app, en vez de interpolarlos como texto suelto.
  function describe(): { text: string; detail?: ReactNode } {
    switch (event.action) {
      case "TASK_CREATED":
        return { text: t("actions.TASK_CREATED") };

      case "TASK_EDITED":
        return { text: t("actions.TASK_EDITED", { fields: listFields(event.payload.fields) }) };

      case "TASK_STATUS_CHANGED":
        return {
          text: t("actions.TASK_STATUS_CHANGED"),
          detail: transition(
            <EnumBadge option={statusOptions[event.payload.from]} />,
            <EnumBadge option={statusOptions[event.payload.to]} />,
          ),
        };

      case "TASK_PRIORITY_CHANGED":
        return {
          text: t("actions.TASK_PRIORITY_CHANGED"),
          detail: transition(
            <EnumBadge option={priorityOptions[event.payload.from]} />,
            <EnumBadge option={priorityOptions[event.payload.to]} />,
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

      case "COMMENT_EDITED":
        return { text: t("actions.COMMENT_EDITED") };

      case "COMMENT_DELETED":
        return { text: t("actions.COMMENT_DELETED") };

      case "PROJECT_CREATED":
        return { text: t("actions.PROJECT_CREATED", { name: event.payload.projectName }) };

      case "PROJECT_UPDATED":
        return { text: t("actions.PROJECT_UPDATED", { fields: listFields(event.payload.fields) }) };

      case "PROJECT_ARCHIVED":
        return { text: t("actions.PROJECT_ARCHIVED", { name: event.payload.projectName }) };

      case "PROJECT_MEMBER_ADDED":
        return { text: t("actions.PROJECT_MEMBER_ADDED", { name }) };

      case "PROJECT_MEMBER_ROLE_CHANGED":
        return {
          text: t("actions.PROJECT_MEMBER_ROLE_CHANGED", { name }),
          detail: transition(
            <EnumBadge option={roleOptions[event.payload.from]} />,
            <EnumBadge option={roleOptions[event.payload.to]} />,
          ),
        };

      case "PROJECT_MEMBER_DEACTIVATED":
        return { text: t("actions.PROJECT_MEMBER_DEACTIVATED", { name }) };

      case "WORKSPACE_CREATED":
        return { text: t("actions.WORKSPACE_CREATED", { name: event.payload.workspaceName }) };

      case "WORKSPACE_UPDATED":
        return { text: t("actions.WORKSPACE_UPDATED", { fields: listFields(event.payload.fields) }) };

      case "WORKSPACE_DEACTIVATED":
        return { text: t("actions.WORKSPACE_DEACTIVATED") };

      case "WORKSPACE_MEMBER_INVITED":
        return { text: t("actions.WORKSPACE_MEMBER_INVITED", { name }) };

      case "WORKSPACE_MEMBER_ACTIVATED":
        return { text: t("actions.WORKSPACE_MEMBER_ACTIVATED", { name }) };

      case "WORKSPACE_MEMBER_ROLE_CHANGED":
        return {
          text: t("actions.WORKSPACE_MEMBER_ROLE_CHANGED", { name }),
          detail: transition(
            <EnumBadge option={roleOptions[event.payload.from]} />,
            <EnumBadge option={roleOptions[event.payload.to]} />,
          ),
        };

      case "WORKSPACE_MEMBER_REMOVED":
        return { text: t("actions.WORKSPACE_MEMBER_REMOVED", { name }) };
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
          <span className="font-medium">{actorName}</span> <span className="text-muted-foreground">{text}</span>
        </p>

        {detail}

        {taskHref && taskRef && event.project && (
          <Link href={taskHref} className="truncate text-xs text-muted-foreground hover:text-foreground">
            {event.project.key}-{taskRef.taskNumber} · {taskRef.taskTitle}
          </Link>
        )}
      </div>

      <time dateTime={event.createdAt} className="shrink-0 text-xs text-muted-foreground">
        {format.relativeTime(new Date(event.createdAt), new Date())}
      </time>
    </div>
  );
}
