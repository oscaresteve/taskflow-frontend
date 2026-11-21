"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { EnumIconLabel } from "@/components/common/enum-display";
import { TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { statusOptions } from "@/lib/task-enums";
import { cn } from "@/lib/utils";
import { SortableKanbanCard } from "./kanban-card";
import { KanbanInlineCreateTask } from "./kanban-inline-create-task";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";

interface KanbanColumnProps {
  workspaceSlug: string;
  projectSlug: string;
  projectKey: string;
  status: TaskStatus;
  tasks: TaskResponseDto[];
  isDropTarget: boolean;
}

export function KanbanColumn({
  workspaceSlug,
  projectSlug,
  projectKey,
  status,
  tasks,
  isDropTarget,
}: KanbanColumnProps) {
  // El droppable de la columna recoge lo que se suelta fuera de una tarjeta: el hueco bajo la
  // ultima o una columna vacia, donde no hay ningun sortable al que apuntar. Su `isOver` no se usa;
  // el resaltado lo decide el board, que sabe en que columna va a caer la tarjeta.
  const { setNodeRef } = useDroppable({ id: status });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // SortableContext reacciona a `items` por identidad, asi que se memoiza: crearlo en cada render
  // le haria recalcular su estado interno continuamente durante el arrastre.
  const itemIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn("flex min-h-0 flex-col gap-3 rounded-lg bg-muted/30 p-2", isDropTarget && "bg-muted/60")}
    >
      {/* La cabecera no entra en el scroll: es lo que dice de que columna son las tarjetas que
          quedan a la vista, y bajando se perdia junto con el resto de la pagina. */}
      <div className="flex shrink-0 items-center gap-2 px-1 text-sm font-medium">
        <EnumIconLabel option={statusOptions[status]} className="text-muted-foreground" />
        <Badge variant="outline" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>

      {/* `relative` no es decorativo: los sr-only de los botones de las tarjetas son absolutos y,
          sin un contenedor posicionado aqui, se colocaban contra el <main> y escapaban a este
          recorte, de modo que la pagina entera volvia a tener scroll pese al alto fijo. */}
      {/* p-1: esto recorta por los cuatro lados —`overflow-y-auto` obliga a `overflow-x` a valer
          `auto` tambien—, y tanto el ring de las tarjetas como el anillo de foco se pintan por
          fuera del borde. Sin estos 4px se cercenaban: de lado siempre, y arriba y abajo en la
          primera y la ultima. De paso alinea las tarjetas con el `px-1` de la cabecera. */}
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl p-1">
        {tasks.length > 0 && (
          <div className="flex shrink-0 flex-col gap-2">
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableKanbanCard
                  key={task.id}
                  href={buildTaskModalHref({
                    pathname,
                    searchParams,
                    workspaceSlug,
                    projectSlug,
                    taskNumber: task.taskNumber,
                  })}
                  taskKey={`${projectKey}-${task.taskNumber}`}
                  task={task}
                  workspaceSlug={workspaceSlug}
                  projectSlug={projectSlug}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {/* shrink-0: son items de un flex con el alto acotado, asi que al abrirse el formulario
            —una Card con overflow-hidden, que por eso puede encogerse por debajo de su contenido—
            se aplastaba en vez de empujar el scroll. */}
        <div className="shrink-0">
          <KanbanInlineCreateTask workspaceSlug={workspaceSlug} projectSlug={projectSlug} status={status} />
        </div>
      </div>
    </div>
  );
}
