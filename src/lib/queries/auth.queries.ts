import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth.api";

export const getMeQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: getMe,
});
