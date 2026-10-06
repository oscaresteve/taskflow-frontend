import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { UserProfileResponseDto, UserSummaryResponseDto } from "@/lib/dtos/users.dto";

export function getUsers({
  search,
  workspaceSlug,
  page,
  limit,
}: {
  search: string;
  workspaceSlug: string;
  page?: number;
  limit?: number;
}) {
  const queryString = buildQueryString({ search: search || undefined, workspaceSlug, page, limit });

  return request<PaginatedResponseDto<UserSummaryResponseDto>>(`/users${queryString}`, {
    method: "GET",
  });
}

export function getUser({ userId }: { userId: string }) {
  return request<UserProfileResponseDto>(`/users/${userId}`, {
    method: "GET",
  });
}
