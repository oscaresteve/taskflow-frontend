export type { SignUpDto } from "../schemas/auth.schema.ts";

export interface UserResponseDto {
  name: string;
  email: string;
  id: string;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
}
