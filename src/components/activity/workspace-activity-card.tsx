"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspaceActivityInfiniteQuery } from "@/lib/queries/activity.queries";
import { ActivityFeed } from "./activity-feed";

const PAGE_SIZE = 15;

interface WorkspaceActivityCardProps {
  workspaceSlug: string;
}

export function WorkspaceActivityCard({ workspaceSlug }: WorkspaceActivityCardProps) {
  const t = useTranslations("activity");
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getWorkspaceActivityInfiniteQuery({ workspaceSlug, limit: PAGE_SIZE }),
  );

  const events = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - events.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityFeed
          workspaceSlug={workspaceSlug}
          events={events}
          remaining={remaining}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          linkTasks
        />
      </CardContent>
    </Card>
  );
}
