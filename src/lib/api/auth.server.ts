import { cache } from "react";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { serverRequest } from "@/lib/http/server-client";

// El unico sitio que de verdad puede seguir sin los datos, y por eso el unico que se come el fallo:
// `i18n/request.ts` resuelve el locale con esto desde el layout raiz, y un throw ahi solo lo
// recogeria `global-error.tsx`, que renderiza su propio documento sin los estilos globales ni las
// traducciones. Sin usuario se cae a `defaultLocale`, que es lo que ya hacia.
//
// `serverFetch` pide `/auth/me` con `cache: "no-store"`, asi que Next no deduplica la peticion por
// su cuenta: envuelto en `cache()` de React, las varias llamadas dentro del mismo render (aqui y en
// `onboarding/page.tsx`) comparten una sola peticion al backend.
export const getCurrentUser = cache(async () => {
  try {
    return await serverRequest<UserResponseDto>("/auth/me");
  } catch {
    return null;
  }
});
