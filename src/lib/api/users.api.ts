import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { UserResponseDto } from "@/lib/dtos/auth.dto";

export function getUsers({
  search,
  workspaceSlug,
  page,
  limit,
}: {
  search: string;
  workspaceSlug?: string;
  page?: number;
  limit?: number;
}) {
  const queryString = buildQueryString({ search: search || undefined, workspaceSlug, page, limit });

  return request<PaginatedResponseDto<UserResponseDto>>(`/users${queryString}`, {
    method: "GET",
  });
}
