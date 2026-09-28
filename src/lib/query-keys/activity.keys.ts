type ActivityListParams = {
  limit?: number;
};

export const activityKeys = {
  all: ["activity"] as const,
  projectInfiniteList: (workspaceSlug: string, projectSlug: string, params: ActivityListParams = {}) =>
    [...activityKeys.all, "project", "infinite-list", workspaceSlug, projectSlug, params] as const,
  taskInfiniteList: (
    workspaceSlug: string,
    projectSlug: string,
    taskNumber: string,
    params: ActivityListParams = {},
  ) => [...activityKeys.all, "task", "infinite-list", workspaceSlug, projectSlug, taskNumber, params] as const,
};
