export type { SignUpDto } from "../schemas/auth.schema.ts";

export interface UserResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  timezone: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDto {
  user: UserResponseDto;
}
