import { AuthResponseDto, UserAvatarUploadUrlResponseDto, UserResponseDto } from "../dtos/auth.dto";
import { SignInDto, SignUpDto, UpdateMeDto } from "../schemas/auth.schema";
import { request } from "@/lib/http/client";

export function signIn(input: SignInDto) {
  return request<AuthResponseDto>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function signUp(input: SignUpDto) {
  return request<AuthResponseDto>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMe() {
  return request<UserResponseDto>("/auth/me", {
    method: "GET",
  });
}

export function updateMe(data: UpdateMeDto) {
  return request<UserResponseDto>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function signOut() {
  return request<void>("/auth/sign-out", {
    method: "POST",
  });
}

export function getMeAvatarUploadUrl({ contentType, fileSize }: { contentType: string; fileSize: number }) {
  return request<UserAvatarUploadUrlResponseDto>("/auth/me/avatar/upload-url", {
    method: "POST",
    body: JSON.stringify({ contentType, fileSize }),
  });
}

export function confirmMeAvatar({ key }: { key: string }) {
  return request<UserResponseDto>("/auth/me/avatar", {
    method: "PUT",
    body: JSON.stringify({ key }),
  });
}

export function deleteMeAvatar() {
  return request<void>("/auth/me/avatar", {
    method: "DELETE",
  });
}
