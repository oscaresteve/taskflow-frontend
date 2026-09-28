"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyInline } from "@/components/common/empty-inline";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { ICONS } from "@/lib/icons";
import { ActivityEntry, getTaskRef } from "./activity-entry";

// Los tres feeds (espacio, proyecto y tarea) solo se diferencian en que consulta montan, asi que
// el aplanado de paginas y la cuenta de lo que falta viven aqui una sola vez.
type ActivityQueryResult = UseInfiniteQueryResult<InfiniteData<PaginatedResponseDto<ActivityEventResponseDto>>>;

interface ActivityFeedProps {
  workspaceSlug: string;
  query: ActivityQueryResult;
  // El feed de una tarea no repite de que tarea habla en cada linea.
  linkTasks?: boolean;
}

export function ActivityFeed({ workspaceSlug, query, linkTasks }: ActivityFeedProps) {
  const t = useTranslations("activity");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = query;

  const events = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - events.length : 0;

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
