import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth.api";
import { authKeys } from "@/lib/query-keys/auth.keys";

export const getMeQuery = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: getMe,
  });
