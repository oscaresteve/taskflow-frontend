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
  const query = useInfiniteQuery(
    getTaskActivityInfiniteQuery({ workspaceSlug, projectSlug, taskNumber, limit: PAGE_SIZE }),
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">{t("title")}</h2>

      <ActivityFeed workspaceSlug={workspaceSlug} query={query} />
    </div>
  );
}
