"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { ICONS } from "@/lib/icons";
import { ActivityEntry, getTaskRef } from "./activity-entry";

interface ActivityFeedProps {
  workspaceSlug: string;
  projectSlug: string;
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
  projectSlug,
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
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));

  // Mismo recurso que el breadcrumb del detalle: la clave del proyecto mientras carga es su slug.
  const projectKey = project?.key ?? projectSlug;

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
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            projectKey={projectKey}
            taskHref={
              linkTasks && taskRef
                ? buildTaskModalHref({
                    pathname,
                    searchParams,
                    workspaceSlug,
                    projectSlug,
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
