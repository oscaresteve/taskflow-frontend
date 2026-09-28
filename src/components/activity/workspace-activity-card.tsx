"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getWorkspaceActivityInfiniteQuery } from "@/lib/queries/activity.queries";
import { ActivityCard } from "./activity-card";

const PAGE_SIZE = 15;

interface WorkspaceActivityCardProps {
  workspaceSlug: string;
}

export function WorkspaceActivityCard({ workspaceSlug }: WorkspaceActivityCardProps) {
  const query = useInfiniteQuery(getWorkspaceActivityInfiniteQuery({ workspaceSlug, limit: PAGE_SIZE }));

  return <ActivityCard workspaceSlug={workspaceSlug} query={query} />;
}
