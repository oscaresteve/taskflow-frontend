import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { serverRequest } from "@/lib/api/server-client";

export function getCurrentUser() {
  return serverRequest<UserResponseDto>("/auth/me");
}
