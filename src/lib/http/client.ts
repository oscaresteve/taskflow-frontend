import { ApiError } from "@/lib/http/api-error";
import { env } from "@/lib/config/env";
import { signInPath } from "@/lib/utils";

interface ValidationErrorResponse {
  message: string;
  errors?: { field: string; message: string }[];
}

// En estas rutas un 401 es una respuesta legitima del backend (credenciales incorrectas, refresh
// token muerto), no una sesion caducada. Renovar aqui taparia el mensaje que el formulario tiene
// que mostrar: escribir mal la contrasena acabaria en un logout en vez de en "Invalid credentials".
const AUTH_PATHS = ["/auth/sign-in", "/auth/sign-up", "/auth/refresh", "/auth/sign-out"];

// Una sola renovacion en vuelo: si varias peticiones reciben 401 a la vez, todas esperan al mismo
// refresh en lugar de disparar uno cada una.
let refreshPromise: Promise<void> | null = null;

// Si varias peticiones fallan a la vez, se navega una sola vez.
let redirecting = false;

function send(path: string, options: RequestInit) {
  return fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function toApiError(res: Response) {
  const body = (await res.json().catch(() => null)) as ValidationErrorResponse | null;
  const message = body?.errors?.length
    ? body.errors.map((e) => e.message).join(" ")
    : (body?.message ?? "Something went wrong");
  return new ApiError(message, res.status);
}

async function refreshSession() {
  // El refresh token viaja en la cookie httpOnly, asi que no hay body: 204 si renueva, 401 si murio.
  const res = await send("/auth/refresh", { method: "POST" });

  if (!res.ok) {
    throw await toApiError(res);
  }
}

function redirectToSignIn() {
  if (redirecting) {
    return;
  }
  redirecting = true;

  const { pathname, search, origin } = window.location;

  // Navegacion dura a proposito (no `router.push`): descarta todo el estado en memoria, incluida la
  // cache de React Query, y deja que el proxy vuelva a evaluar la sesion desde cero.
  window.location.assign(new URL(signInPath(pathname + search), origin));
}

// Este cliente se usa desde el navegador, asi que las cookies viajan solas con credentials: "include"
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res = await send(path, options);

  // Un 401 fuera de las rutas de auth es casi siempre el access token vencido (dura 15 min): se
  // renueva y se reintenta una unica vez, nunca en bucle.
  if (res.status === 401 && !AUTH_PATHS.includes(path)) {
    try {
      refreshPromise ??= refreshSession().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
    } catch (error) {
      redirectToSignIn();
      throw error;
    }

    res = await send(path, options);
  }

  if (!res.ok) {
    throw await toApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
