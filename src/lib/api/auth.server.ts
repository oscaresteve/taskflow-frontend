import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { serverRequest } from "@/lib/http/server-client";

export function getCurrentUser() {
  return serverRequest<UserResponseDto>("/auth/me");
}
