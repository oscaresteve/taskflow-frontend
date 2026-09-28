import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveTask } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { MoveTaskDto, TaskResponseDto } from "@/lib/dtos/tasks.dto";

interface MoveTaskInput {
  task: TaskResponseDto;
  placement: MoveTaskDto;
  // El tablero tal y como estaba antes de arrastrar. La posicion nueva ya la dejo pintada el
  // arrastre (la cache del tablero es su estado mientras dura), asi que aqui solo queda deshacerla
  // si el servidor rechaza el movimiento.
  rollbackTo: TaskResponseDto[] | undefined;
}

export function useMoveTask(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();
  const boardKey = taskKeys.board(workspaceSlug, projectSlug);

  return useMutation({
    mutationFn: ({ task, placement }: MoveTaskInput) =>
      moveTask({ workspaceSlug, projectSlug, taskNumber: String(task.taskNumber), data: placement }),

    onError: (_error, { rollbackTo }) => {
      if (rollbackTo) queryClient.setQueryData(boardKey, rollbackTo);
    },

    onSettled: (_data, _error, { task }) => {
      // El servidor recalcula el rank, asi que la lista buena es siempre la suya.
      queryClient.invalidateQueries({ queryKey: boardKey });
      // El detalle guarda status y completedAt, que el movimiento acaba de cambiar.
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(workspaceSlug, projectSlug, String(task.taskNumber)),
      });
    },
  });
}
