import { cookies } from "next/headers";
import { env } from "@/lib/config/env";

// Se usa desde el servidor, por lo tanto hay que enviar las cookies manualmente
export async function serverRequest<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    return null;
  }

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}
