"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjectActivityInfiniteQuery } from "@/lib/queries/activity.queries";
import { ActivityCard } from "./activity-card";

const PAGE_SIZE = 15;

interface ProjectActivityCardProps {
  workspaceSlug: string;
  projectSlug: string;
}

export function ProjectActivityCard({ workspaceSlug, projectSlug }: ProjectActivityCardProps) {
  const query = useInfiniteQuery(getProjectActivityInfiniteQuery({ workspaceSlug, projectSlug, limit: PAGE_SIZE }));

  return <ActivityCard workspaceSlug={workspaceSlug} query={query} />;
}
