"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

// La accion unica de una fila se pinta en la propia fila, no detras de un menu de un solo elemento:
// en las pestanas de bajas (archivados, inactivos, pendientes, eliminados) solo hay un camino, y
// esconderlo obliga a abrir un desplegable para descubrir que no habia nada que elegir.
//
// Va en ghost y sin excepcion, tampoco para dar de baja o cancelar: una tabla repite la misma accion
// en todas sus filas, y un rojo —o un borde— que sale en cada una se lee como el estilo de la tabla
// y deja de avisar. El aviso lo da el dialogo de confirmacion, que es donde se decide.
export function RowActionButton({ className, ...props }: Omit<ComponentProps<typeof Button>, "variant">) {
  return <Button variant="ghost" size="sm" className={className} {...props} />;
}
