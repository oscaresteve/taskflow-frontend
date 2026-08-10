import { AuthResponseDto } from "../dtos/auth.dto";
import { SignInDto } from "../schemas/auth.schema";
import { request } from "./client";

export function signIn(input: SignInDto) {
  return request<AuthResponseDto>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
