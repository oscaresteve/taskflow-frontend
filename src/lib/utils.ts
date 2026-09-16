import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function getFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
}

export function isOverdue(date: string | Date) {
  return new Date(date) < new Date()
}

// Solo se aceptan rutas internas: "//evil.com" y "https://evil.com" tambien son destinos validos
// para el navegador, asi que un `next` sin filtrar seria un open redirect. Tampoco se acepta /auth,
// que volveria a entrar en la regla del proxy que saca de las rutas de login.
export function safeNextPath(next: string | string[] | null | undefined) {
  const path = Array.isArray(next) ? next[0] : next

  if (!path?.startsWith("/") || path.startsWith("//") || path.startsWith("/auth")) {
    return "/"
  }

  return path
}

// La usan el proxy (servidor) y el cliente HTTP (navegador) para mandar al login conservando el
// destino, asi que vive aqui en vez de duplicarse en los dos runtimes.
export function signInPath(next: string) {
  const safe = safeNextPath(next)

  return safe === "/" ? "/auth/sign-in" : `/auth/sign-in?next=${encodeURIComponent(safe)}`
}
