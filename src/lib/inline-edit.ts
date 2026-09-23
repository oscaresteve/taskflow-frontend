import { FocusEvent } from "react"

// Los editores inline se cierran al perder el foco. No cuenta el foco que se queda dentro del
// formulario (botones de guardar/cancelar), ni el que se va a un popup abierto desde el propio
// formulario: Base UI lo renderiza en un portal, pero deja `data-popup-open` en su trigger.
export function focusLeftForm(event: FocusEvent<HTMLFormElement>) {
  const form = event.currentTarget

  if (form.querySelector("[data-popup-open]")) {
    return false
  }

  return !event.relatedTarget || !form.contains(event.relatedTarget)
}
