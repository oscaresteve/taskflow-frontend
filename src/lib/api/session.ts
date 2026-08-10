import { cookies } from "next/headers";
import { UserResponseDto } from "../dtos/auth.dto";

// Se usa desde el servidor, por lo tanto hay que enviar las cookies manualmente
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function getCurrentUser(): Promise<UserResponseDto | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return null;
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<UserResponseDto>;
}
