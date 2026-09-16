import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { serverFetch } from "@/lib/http/server-client";
import { safeNextPath, signInPath } from "@/lib/utils";

// El valor llega tal cual lo emitio Express. Un JWT solo usa caracteres que no se escapan, asi que
// se puede guardar directamente sin decodificar.
function readAccessToken(setCookies: string[]) {
  for (const setCookie of setCookies) {
    const [pair] = setCookie.split(";");
    const separator = pair.indexOf("=");

    if (pair.slice(0, separator).trim() === "accessToken") {
      return pair.slice(separator + 1);
    }
  }

  return null;
}

function redirectToSignIn(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  return NextResponse.redirect(new URL(signInPath(pathname + search), request.url));
}

function redirectToApp(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  return NextResponse.redirect(new URL(next, request.url));
}

export async function proxy(request: NextRequest) {
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const cookieHeader = request.headers.get("cookie") ?? "";

  const me = await serverFetch("/auth/me", cookieHeader);

  if (me.ok) {
    return isAuthRoute ? redirectToApp(request) : NextResponse.next();
  }

  // Un 5xx o un backend caido no son motivo para cerrar la sesion: dejamos pasar y que el error se
  // manifieste al renderizar los datos, no como un logout.
  if (me.status !== 401) {
    return NextResponse.next();
  }

  // Access token vencido. El refresh token viaja en la cookie httpOnly, asi que basta con reenviar
  // el header `cookie`. Renovar solo se puede hacer aqui: un RSC no puede escribir cookies.
  const refreshed = await serverFetch("/auth/refresh", cookieHeader, { method: "POST" });

  if (!refreshed.ok) {
    if (refreshed.status !== 401) {
      return NextResponse.next();
    }

    return isAuthRoute ? NextResponse.next() : redirectToSignIn(request);
  }

  const setCookies = refreshed.res.headers.getSetCookie();
  const accessToken = readAccessToken(setCookies);

  // Se reescribe la cookie del propio request para que el render de esta misma peticion ya vea el
  // token nuevo: los layouts y `src/i18n/request.ts` vuelven a llamar al backend durante el render,
  // y con el token viejo `requireWorkspaces()` mandaria al usuario a /onboarding.
  if (accessToken) {
    request.cookies.set("accessToken", accessToken);
  }

  const response = isAuthRoute
    ? redirectToApp(request)
    : NextResponse.next({ request: { headers: request.headers } });

  // Se reenvia el `Set-Cookie` crudo del backend para conservar tal cual `expires`, `secure` y
  // `sameSite`. En un redirect tambien hay que adjuntarlo, si no el navegador no lo guarda.
  for (const setCookie of setCookies) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
