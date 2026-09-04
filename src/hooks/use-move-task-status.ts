import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/lib/api/tasks.api";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";

type ColumnData = InfiniteData<PaginatedResponseDto<TaskResponseDto>, number>;

function removeTask(data: ColumnData | undefined, taskId: string): ColumnData | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => {
      const hadTask = page.data.some((task) => task.id === taskId);
      return {
        ...page,
        data: page.data.filter((task) => task.id !== taskId),
        pagination: hadTask ? { ...page.pagination, total: page.pagination.total - 1 } : page.pagination,
      };
    }),
  };
}

function addTask(data: ColumnData | undefined, task: TaskResponseDto): ColumnData | undefined {
  if (!data || data.pages.length === 0) return data;
  const [first, ...rest] = data.pages;
  return {
    ...data,
    pages: [
      { ...first, data: [task, ...first.data], pagination: { ...first.pagination, total: first.pagination.total + 1 } },
      ...rest.map((page) => ({ ...page, pagination: { ...page.pagination, total: page.pagination.total + 1 } })),
    ],
  };
}

interface MoveTaskStatusInput {
  task: TaskResponseDto;
  toStatus: TaskStatus;
}

// Drag-and-drop moves a task across two column caches at once (it leaves one status's list and
// enters another's), so it can't reuse useUpdateTask's single-detail invalidate-and-refetch — that
// would mean waiting on a round trip before the card visually lands in its new column. This mutates
// both column caches optimistically and rolls them back on failure.
export function useMoveTaskStatus(workspaceSlug: string, projectSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ task, toStatus }: MoveTaskStatusInput) =>
      updateTask({
        workspaceSlug,
        projectSlug,
        taskNumber: String(task.taskNumber),
        data: { status: toStatus },
      }),

    onMutate: async ({ task, toStatus }) => {
      const fromKey = taskKeys.columnList(workspaceSlug, projectSlug, task.status);
      const toKey = taskKeys.columnList(workspaceSlug, projectSlug, toStatus);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: fromKey }),
        queryClient.cancelQueries({ queryKey: toKey }),
      ]);

      const previousFrom = queryClient.getQueriesData<ColumnData>({ queryKey: fromKey });
      const previousTo = queryClient.getQueriesData<ColumnData>({ queryKey: toKey });

      queryClient.setQueriesData<ColumnData>({ queryKey: fromKey }, (data) => removeTask(data, task.id));
      queryClient.setQueriesData<ColumnData>({ queryKey: toKey }, (data) => addTask(data, { ...task, status: toStatus }));

      return { previousFrom, previousTo };
    },

    onError: (_error, _variables, context) => {
      context?.previousFrom.forEach(([key, data]) => queryClient.setQueryData(key, data));
      context?.previousTo.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.columnLists(workspaceSlug, projectSlug) });
    },
  });
}
