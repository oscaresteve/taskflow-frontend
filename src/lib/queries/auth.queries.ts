import { queryOptions } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth.api";

export const meQuery = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: getMe,
});
