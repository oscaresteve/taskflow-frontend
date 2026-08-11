import { AuthResponseDto, UserResponseDto } from "../dtos/auth.dto";
import { SignInDto, SignUpDto } from "../schemas/auth.schema";
import { request } from "./client";

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
