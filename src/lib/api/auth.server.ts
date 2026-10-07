import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { serverRequest } from "@/lib/http/server-client";

// El unico sitio que de verdad puede seguir sin los datos, y por eso el unico que se come el fallo:
// `i18n/request.ts` resuelve el locale con esto desde el layout raiz, y un throw ahi solo lo
// recogeria `global-error.tsx`, que renderiza su propio documento sin los estilos globales ni las
// traducciones. Sin usuario se cae a `defaultLocale`, que es lo que ya hacia.
export async function getCurrentUser() {
  try {
    return await serverRequest<UserResponseDto>("/auth/me");
  } catch {
    return null;
  }
}
