import { queryOptions } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/users.api";
import { userKeys } from "@/lib/query-keys/user.keys";

export const getUsersQuery = (search: string, workspaceSlug?: string) =>
  queryOptions({
    queryKey: userKeys.lists(search, workspaceSlug),
    queryFn: () => getUsers({ search, workspaceSlug }),
  });
