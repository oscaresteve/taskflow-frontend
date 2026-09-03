import { infiniteQueryOptions } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/users.api";
import { userKeys } from "@/lib/query-keys/user.keys";
import { getNextPageParam } from "@/lib/queries/pagination";

// "Load more" for the member picker — search is server-side (via `search`), pagination accumulates
// pages instead of replacing them, same shape as the sidebar nav infinite queries.
export const getUsersInfiniteQuery = (search: string, workspaceSlug: string | undefined, limit: number) =>
  infiniteQueryOptions({
    queryKey: userKeys.infiniteList(search, workspaceSlug, limit),
    queryFn: ({ pageParam }) => getUsers({ search, workspaceSlug, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam,
  });
