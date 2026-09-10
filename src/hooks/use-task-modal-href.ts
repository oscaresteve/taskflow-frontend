"use client";

import { usePathname, useSearchParams } from "next/navigation";

// Cualquier UI que abra una tarea (tarjeta del kanban, fila de "Resumen" o de "Mis tareas"
// mas adelante) construye el link asi: solo agrega los query params sobre la pagina actual,
// sin depender de en que ruta este montado.
export function buildTaskModalHref({
  pathname,
  searchParams,
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  pathname: string;
  searchParams: URLSearchParams;
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: number | string;
}) {
  const params = new URLSearchParams(searchParams);
  params.set("taskWorkspace", workspaceSlug);
  params.set("taskProject", projectSlug);
  params.set("taskNumber", String(taskNumber));

  return `${pathname}?${params.toString()}`;
}

// Para un solo link (un boton, una fila suelta). Para listas, llama usePathname()/
// useSearchParams() una vez en el componente padre y usa buildTaskModalHref por item —
// un hook no puede llamarse dentro de un .map().
export function useTaskModalHref({
  workspaceSlug,
  projectSlug,
  taskNumber,
}: {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: number | string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return buildTaskModalHref({ pathname, searchParams, workspaceSlug, projectSlug, taskNumber });
}
