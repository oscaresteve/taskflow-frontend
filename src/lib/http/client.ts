import { ApiError } from "@/lib/http/api-error";
import { env } from "@/lib/config/env";

interface ValidationErrorResponse {
  message: string;
  errors?: { field: string; message: string }[];
}

// Este cliente se usa desde el navegador, asi que las cookies viajan solas con credentials: "include"
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as ValidationErrorResponse | null;
    const message = body?.errors?.length
      ? body.errors.map((e) => e.message).join(" ")
      : (body?.message ?? "Something went wrong");
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
