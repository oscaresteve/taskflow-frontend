export const userKeys = {
  all: ["users"] as const,
  lists: (search: string, workspaceSlug?: string) => [...userKeys.all, "list", search, workspaceSlug] as const,
  infiniteList: (search: string, workspaceSlug: string | undefined, limit: number) =>
    [...userKeys.all, "infinite-list", search, workspaceSlug, limit] as const,
};
