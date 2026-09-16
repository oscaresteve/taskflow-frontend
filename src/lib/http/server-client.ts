import { cookies } from "next/headers";
import { env } from "@/lib/config/env";

// status null = el fetch fallo (backend caido o error de red), no llego a haber respuesta HTTP.
export type ServerResult = { ok: true; res: Response } | { ok: false; status: number | null };

// Se usa desde el servidor, por lo tanto hay que enviar las cookies manualmente. Devuelve la
// respuesta cruda porque cada llamador mira una cosa distinta: el cuerpo, o las cabeceras.
export async function serverFetch(
  path: string,
  cookieHeader: string,
  options: RequestInit = {},
): Promise<ServerResult> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: { Cookie: cookieHeader, ...options.headers },
      cache: "no-store",
    });

    return res.ok ? { ok: true, res } : { ok: false, status: res.status };
  } catch {
    return { ok: false, status: null };
  }
}

// Los RSC solo necesitan saber si hay datos o no; el porque de un fallo no cambia lo que pintan.
// El proxy si usa `serverFetch` directamente, porque necesita el status para distinguir un access
// token vencido (401, hay que renovar) de un backend reiniciandose (5xx, no hay que cerrar sesion).
export async function serverRequest<T>(path: string): Promise<T | null> {
  const cookieHeader = (await cookies()).toString();

  if (!cookieHeader) {
    return null;
  }

  const result = await serverFetch(path, cookieHeader);

  return result.ok ? ((await result.res.json()) as T) : null;
}
