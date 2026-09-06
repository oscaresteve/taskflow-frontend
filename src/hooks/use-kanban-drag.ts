"use client";

import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MoveTaskDto, TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { taskKeys } from "@/lib/query-keys/task.keys";
import {
  BoardColumns,
  findColumn,
  groupByStatus,
  isTaskStatus,
  moveTaskInList,
  placementAt,
  placementOf,
} from "@/lib/kanban";
import { useMoveTask } from "@/hooks/use-move-task";

// Referencia estable para cuando la query aun no ha traido nada, para no rehacer los useMemo.
const NO_TASKS: TaskResponseDto[] = [];

// El hueco se abre por encima o por debajo del elemento apuntado segun por donde vaya la tarjeta
// arrastrada respecto a su mitad.
function isBelowOver({ active, over }: DragOverEvent | DragEndEvent): boolean {
  const dragged = active.rect.current.translated;

  return Boolean(dragged && over && dragged.top > over.rect.top + over.rect.height / 2);
}

// Donde caeria la tarjeta si se soltara ahora.
//
// Dentro de una misma columna manda el indice del elemento apuntado, porque es exactamente lo que
// SortableContext ya esta previsualizando; usar la geometria aqui haria que el sitio final no
// coincidiera con el hueco que se ve. Al entrar en otra columna no hay nada previsualizado todavia,
// asi que ahi si decide la geometria.
function dropPlacement({
  columns,
  activeId,
  overId,
  below,
}: {
  columns: BoardColumns;
  activeId: string;
  overId: string;
  below: boolean;
}): MoveTaskDto | null {
  if (overId === activeId) return null;

  const status = findColumn(columns, overId);
  if (!status) return null;

  // Se ha soltado sobre la columna y no sobre una tarjeta: el hueco libre bajo la ultima, o una
  // columna vacia. En ambos casos va al final.
  if (isTaskStatus(overId)) return placementAt(columns, activeId, status, columns[status].length);

  const column = columns[status];
  const overIndex = column.findIndex((task) => task.id === overId);
  const isSameColumn = column.some((task) => task.id === activeId);

  return placementAt(columns, activeId, status, isSameColumn ? overIndex : overIndex + (below ? 1 : 0));
}

/**
 * Toda la maquina de arrastre del tablero. El componente solo la cablea con dnd-kit y pinta.
 *
 * Regla que ordena lo demas: mientras se arrastra, la cache del tablero ES el estado del arrastre.
 * No hay una copia local que mantener en sincronia, asi que la tarjeta nunca puede estar en dos
 * sitios distintos segun se mire. Cambiar de columna se escribe en la cache al vuelo (es lo que
 * SortableContext no sabe hacer), reordenar dentro de una columna se deja a SortableContext, y al
 * soltar se escribe la posicion final y se manda al servidor. Si algo falla o el arrastre se
 * cancela, se vuelve a la foto que se tomo al empezar.
 */
export function useKanbanDrag({
  workspaceSlug,
  projectSlug,
  tasks,
}: {
  workspaceSlug: string;
  projectSlug: string;
  tasks: TaskResponseDto[] | undefined;
}) {
  const queryClient = useQueryClient();
  const boardKey = taskKeys.board(workspaceSlug, projectSlug);
  const moveTask = useMoveTask(workspaceSlug, projectSlug);

  const [activeTask, setActiveTask] = useState<TaskResponseDto | null>(null);

  // El tablero y la posicion de la tarjeta antes de empezar a arrastrar: a esto se vuelve si el
  // arrastre se cancela, no mueve nada o el servidor lo rechaza. Son refs porque solo se leen desde
  // los handlers; cambiarlos no tiene que repintar nada.
  const boardBeforeDrag = useRef<TaskResponseDto[] | undefined>(undefined);
  const placementBeforeDrag = useRef<MoveTaskDto | null>(null);

  const columns = useMemo(() => groupByStatus(tasks ?? NO_TASKS), [tasks]);

  // Un click limpio sobre una tarjeta debe navegar a su detalle, asi que el puntero tiene que
  // recorrer unos pixeles antes de que esto cuente como arrastre.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Los handlers leen el tablero de la cache y no del `columns` memoizado: durante el arrastre la
  // cache es el estado, y asi no dependen de que React ya haya repintado con la ultima
  // previsualizacion.
  function boardColumns(): BoardColumns {
    return groupByStatus(queryClient.getQueryData<TaskResponseDto[]>(boardKey) ?? NO_TASKS);
  }

  function previewMove(taskId: string, placement: MoveTaskDto) {
    queryClient.setQueryData<TaskResponseDto[]>(boardKey, (board) =>
      board ? moveTaskInList(board, taskId, placement) : board,
    );
  }

  function restoreBoard() {
    const previous = boardBeforeDrag.current;

    // Solo si de verdad se llego a escribir: en el caso normal, un arrastre que no cambia nada no
    // debe reemplazar la cache por una foto vieja.
    if (previous && queryClient.getQueryData(boardKey) !== previous) {
      queryClient.setQueryData(boardKey, previous);
    }
  }

  function onDragStart({ active }: DragStartEvent) {
    const task = active.data.current?.task as TaskResponseDto | undefined;
    if (!task) return;

    // Un refetch que aterrice a mitad del arrastre pisaria la previsualizacion.
    queryClient.cancelQueries({ queryKey: boardKey });

    boardBeforeDrag.current = queryClient.getQueryData<TaskResponseDto[]>(boardKey);
    placementBeforeDrag.current = placementOf(boardColumns(), task.id);
    setActiveTask(task);
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const columns = boardColumns();
    const activeId = String(active.id);
    const overId = String(over.id);

    // Reordenar dentro de una columna ya lo previsualiza SortableContext abriendo hueco. Escribir
    // aqui solo haria que los dos se peleasen por la misma posicion.
    if (findColumn(columns, activeId) === findColumn(columns, overId)) return;

    const placement = dropPlacement({ columns, activeId, overId, below: isBelowOver(event) });
    if (placement) previewMove(activeId, placement);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const task = activeTask;
    const from = placementBeforeDrag.current;

    setActiveTask(null);

    if (!task || !from) {
      restoreBoard();
      return;
    }

    const columns = boardColumns();
    const dropped = over
      ? dropPlacement({
          columns,
          activeId: String(active.id),
          overId: String(over.id),
          below: isBelowOver(event),
        })
      : null;

    // Cuando el evento no resuelve a un destino se queda lo que ya se esta viendo. El caso normal
    // no es raro: al cambiar de columna la tarjeta se coloca bajo el puntero, asi que a partir de
    // ahi `over` es ella misma. Interpretar eso como "no hay destino" era descartar el movimiento
    // justo despues de haberlo previsualizado.
    const to = dropped ?? placementOf(columns, task.id);

    // De vuelta a donde estaba: se deshace la previsualizacion y no se manda nada.
    if (!to || (to.status === from.status && to.afterTaskId === from.afterTaskId)) {
      restoreBoard();
      return;
    }

    // La posicion final se escribe de forma sincrona, antes de que dnd-kit mida el nodo destino
    // para animar la salida del overlay. Si no, la tarjeta se veria volver al origen y saltar
    // despues a su sitio cuando llegase el update.
    if (dropped) previewMove(task.id, dropped);
    moveTask.mutate({ task, placement: to, rollbackTo: boardBeforeDrag.current });
  }

  function onDragCancel() {
    setActiveTask(null);
    restoreBoard();
  }

  return {
    activeTask,
    columns,
    // La columna destino es, sencillamente, donde esta ahora la tarjeta arrastrada. No se usa el
    // `isOver` de useDroppable: ese solo es true cuando la colision resuelve al contenedor, asi que
    // al pasar por encima de una tarjeta se apagaba y el resaltado parpadeaba.
    dropStatus: activeTask ? findColumn(columns, activeTask.id) : null,
    sensors,
    collisionDetection: closestCorners,
    handlers: { onDragStart, onDragOver, onDragEnd, onDragCancel },
  };
}
