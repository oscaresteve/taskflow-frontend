import { request } from "@/lib/http/client";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { UserResponseDto } from "@/lib/dtos/auth.dto";

export function getUsers({ search, workspaceSlug }: { search: string; workspaceSlug?: string }) {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  if (workspaceSlug) {
    params.set("workspaceSlug", workspaceSlug);
  }

  return request<PaginatedResponseDto<UserResponseDto>>(`/users?${params.toString()}`, {
    method: "GET",
  });
}
