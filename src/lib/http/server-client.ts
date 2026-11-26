import { cookies } from "next/headers";
import { env } from "@/lib/config/env";
import { ApiError } from "@/lib/http/api-error";

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

// `null` significa una sola cosa: el backend ha contestado que no hay nada que ensenar (404 no
// existe, 403 no es tuyo). Cualquier otro fallo lanza, porque quien llama decide la ruta a partir de
// esa respuesta y un `null` que tambien significase "el backend se cayo" le haria mentir: un 503
// mandaba al usuario a /onboarding y pintaba "workspace no encontrado".
//
// El proxy usa `serverFetch` directamente, porque necesita el status para distinguir un access token
// vencido (401, hay que renovar) de un backend reiniciandose (5xx, no hay que cerrar sesion).
const CONCLUSIVE_NO = [403, 404];

export async function serverRequest<T>(path: string): Promise<T | null> {
  const cookieHeader = (await cookies()).toString();

  // Sin sesion no hay nada que preguntar. En rutas privadas el proxy ya ha redirigido al login antes
  // de llegar aqui, asi que esto solo se da donde la pagina sabe seguir sin usuario.
  if (!cookieHeader) {
    return null;
  }

  const result = await serverFetch(path, cookieHeader);

  if (result.ok) {
    return (await result.res.json()) as T;
  }

  if (result.status !== null && CONCLUSIVE_NO.includes(result.status)) {
    return null;
  }

  throw new ApiError(`Request to ${path} failed`, result.status);
}
