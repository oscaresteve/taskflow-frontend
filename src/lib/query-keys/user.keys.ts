export const userKeys = {
  all: ["users"] as const,
  infiniteList: (search: string, workspaceSlug: string | undefined, limit: number) =>
    [...userKeys.all, "infinite-list", search, workspaceSlug, limit] as const,
};
