import { clsx, type ClassValue } from "clsx"
import { startOfToday } from "date-fns"
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

// `dueDate` es un dia de calendario, no un instante: viaja y se guarda como la medianoche UTC de ese
// dia para que todo el mundo vea la misma fecha. Para pintarlo o pasarlo al calendario hay que
// leerlo con los getters UTC y rearmarlo en local, porque interpretarlo como instante lo corre un
// dia en cuanto la zona del visor no es UTC.
export function parseDueDate(dueDate: string) {
  const day = new Date(dueDate)

  return new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())
}

// La inversa: el calendario devuelve la medianoche local del dia elegido y al backend va la
// medianoche UTC de ese mismo dia.
export function toDueDate(day: Date) {
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())).toISOString()
}

// Vencida es "su dia limite ya paso", no "su instante ya paso": lo que vence hoy no esta vencido
// hasta manana. Comparar instantes lo pintaba vencido desde las 00:00 del propio dia de vencimiento.
export function isOverdue(dueDate: string) {
  return parseDueDate(dueDate) < startOfToday()
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
