"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

// La accion unica de una fila se pinta en la propia fila, no detras de un menu de un solo elemento:
// en las pestanas de bajas (archivados, inactivos, pendientes, eliminados) solo hay un camino, y
// esconderlo obliga a abrir un desplegable para descubrir que no habia nada que elegir.
//
// `variant="destructive"` para la accion que da de baja, que es tinte suave, no un boton rojo.
export function RowActionButton({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button variant="outline" size="sm" className={className} {...props} />;
}
