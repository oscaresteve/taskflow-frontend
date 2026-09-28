"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { getFullName } from "@/lib/utils";
import { ICONS } from "@/lib/icons";
import { ActivityEntry, getTaskRef } from "./activity-entry";

interface ActivityFeedProps {
  workspaceSlug: string;
  events: ActivityEventResponseDto[];
  remaining: number;
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  // El feed de una tarea no repite de que tarea habla en cada linea.
  linkTasks?: boolean;
}

export function ActivityFeed({
  workspaceSlug,
  events,
  remaining,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  linkTasks,
}: ActivityFeedProps) {
  const t = useTranslations("activity");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Una sola consulta para todos los nombres del feed: cualquier objetivo de un evento, tambien
  // los de miembro de proyecto, es miembro del espacio.
  const { data: members } = useQuery(getWorkspaceMembersQuery(workspaceSlug));

  const memberNames = useMemo(
    () => new Map((members ?? []).map((member) => [member.userId, getFullName(member.user.firstName, member.user.lastName)])),
    [members],
  );

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("failedToLoad")}</p>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyInline icon={ICONS.activity} label={t("empty")} className="py-2" />;
  }

  return (
    <div className="flex flex-col divide-y">
      {events.map((event) => {
        const taskRef = getTaskRef(event);

        return (
          <ActivityEntry
            key={event.id}
            event={event}
            memberNames={memberNames}
            taskHref={
              linkTasks && taskRef && event.project
                ? buildTaskModalHref({
                    pathname,
                    searchParams,
                    workspaceSlug,
                    projectSlug: event.project.slug,
                    taskNumber: taskRef.taskNumber,
                  })
                : undefined
            }
          />
        );
      })}

      {hasNextPage && (
        <button
          type="button"
          onClick={() => !isFetchingNextPage && fetchNextPage()}
          aria-disabled={isFetchingNextPage}
          className="cursor-pointer self-start py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {isFetchingNextPage ? t("loading") : t("remaining", { count: remaining })}
        </button>
      )}
    </div>
  );
}
