"use client";

import { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeed } from "./activity-feed";

export function ActivityCard({ workspaceSlug, query }: ComponentProps<typeof ActivityFeed>) {
  const t = useTranslations("activity");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityFeed workspaceSlug={workspaceSlug} query={query} linkTasks />
      </CardContent>
    </Card>
  );
}
