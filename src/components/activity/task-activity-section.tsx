"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getTaskActivityInfiniteQuery } from "@/lib/queries/activity.queries";
import { ActivityFeed } from "./activity-feed";

const PAGE_SIZE = 10;

interface TaskActivitySectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
}

export function TaskActivitySection({ workspaceSlug, projectSlug, taskNumber }: TaskActivitySectionProps) {
  const t = useTranslations("activity");
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getTaskActivityInfiniteQuery({ workspaceSlug, projectSlug, taskNumber, limit: PAGE_SIZE }),
  );

  const events = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - events.length : 0;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">{t("title")}</h2>

      <ActivityFeed
        workspaceSlug={workspaceSlug}
        events={events}
        remaining={remaining}
        isLoading={isLoading}
        isError={isError}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
