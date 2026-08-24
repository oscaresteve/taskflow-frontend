export const userKeys = {
  all: ["users"] as const,
  lists: (search: string, workspaceSlug?: string) => [...userKeys.all, "list", search, workspaceSlug] as const,
};
