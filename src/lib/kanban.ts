import { isThisWeek } from "date-fns";
import { MoveTaskDto, TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { ALL_ASSIGNEES, DueDateFilter, PriorityFilter, UNASSIGNED } from "@/lib/task-enums";
import { isOverdue } from "@/lib/utils";

export type BoardColumns = Record<TaskStatus, TaskResponseDto[]>;

// Los ids que maneja dnd-kit son de dos clases: el de una tarea o el de una columna, que es su
// propio estado.
export function isTaskStatus(value: string): value is TaskStatus {
  return (taskStatuses as readonly string[]).includes(value);
}

// El servidor devuelve la lista ya ordenada por rank, asi que agrupar conserva el orden de cada
// columna sin necesidad de volver a ordenar.
export function groupByStatus(tasks: TaskResponseDto[]): BoardColumns {
  const columns = {} as BoardColumns;

  for (const status of taskStatuses) {
    columns[status] = [];
  }

  for (const task of tasks) {
    columns[task.status].push(task);
  }

  return columns;
}

// En que columna cae un id, sea el de una tarea o el de la propia columna.
export function findColumn(columns: BoardColumns, id: string): TaskStatus | null {
  if (isTaskStatus(id)) return id;

  return taskStatuses.find((status) => columns[status].some((task) => task.id === id)) ?? null;
}

// Posicion actual de una tarea, expresada como la espera el servidor. Se usa para comparar contra
// el destino del arrastre y saltarse la peticion cuando la tarjeta acaba donde empezo.
export function placementOf(columns: BoardColumns, taskId: string): MoveTaskDto | null {
  const status = findColumn(columns, taskId);
  if (!status) return null;

  const index = columns[status].findIndex((task) => task.id === taskId);

  return { status, afterTaskId: index > 0 ? columns[status][index - 1].id : null };
}

// Traduce "la tarea va en la posicion `index` de esta columna" al ancla del contrato: queda justo
// detras de afterTaskId, o la primera si es null. El indice se interpreta sobre la columna sin la
// propia tarea, que es como queda al sacarla de donde estaba.
export function placementAt(
  columns: BoardColumns,
  taskId: string,
  status: TaskStatus,
  index: number,
): MoveTaskDto {
  const rest = columns[status].filter((task) => task.id !== taskId);
  const at = Math.min(Math.max(index, 0), rest.length);

  return { status, afterTaskId: at > 0 ? rest[at - 1].id : null };
}

// Aplica un movimiento sobre la lista plana del tablero. Es la unica escritura del estado del
// tablero: la usan tanto la previsualizacion del arrastre como el update optimista al soltar.
export function moveTaskInList(
  tasks: TaskResponseDto[],
  taskId: string,
  { status, afterTaskId }: MoveTaskDto,
): TaskResponseDto[] {
  const task = tasks.find((candidate) => candidate.id === taskId);
  if (!task) return tasks;

  const rest = tasks.filter((candidate) => candidate.id !== taskId);
  const moved = task.status === status ? task : { ...task, status };

  let at: number;

  if (afterTaskId) {
    const anchor = rest.findIndex((candidate) => candidate.id === afterTaskId);

    // El ancla ya no esta en la lista: preferimos no tocar nada a colocarla en un sitio inventado.
    if (anchor === -1) return tasks;

    at = anchor + 1;
  } else {
    // Al principio de su columna, o al final de la lista si la columna esta vacia.
    const firstOfColumn = rest.findIndex((candidate) => candidate.status === status);
    at = firstOfColumn === -1 ? rest.length : firstOfColumn;
  }

  return [...rest.slice(0, at), moved, ...rest.slice(at)];
}

export interface KanbanFilters {
  search: string;
  assigneeId: string;
  priority: PriorityFilter;
  dueDate: DueDateFilter;
}

function matchesAssignee(task: TaskResponseDto, assigneeId: string): boolean {
  if (assigneeId === ALL_ASSIGNEES) return true;
  if (assigneeId === UNASSIGNED) return task.assigneeId === null;
  return task.assigneeId === assigneeId;
}

function matchesDueDate(task: TaskResponseDto, dueDate: DueDateFilter): boolean {
  if (dueDate === "ALL") return true;
  if (dueDate === "NONE") return task.dueDate === null;
  if (task.dueDate === null) return false;
  if (dueDate === "OVERDUE") return isOverdue(task.dueDate);
  return isThisWeek(task.dueDate, { weekStartsOn: 1 });
}

// El tablero se trae completo (el drag-and-drop necesita el orden por rank de todas las tareas),
// asi que los filtros se aplican en cliente sobre ese mismo array antes de agruparlo en columnas.
export function filterBoardTasks(tasks: TaskResponseDto[], filters: KanbanFilters): TaskResponseDto[] {
  const search = filters.search.trim().toLowerCase();

  return tasks.filter(
    (task) =>
      (!search || task.title.toLowerCase().includes(search)) &&
      matchesAssignee(task, filters.assigneeId) &&
      (filters.priority === "ALL" || task.priority === filters.priority) &&
      matchesDueDate(task, filters.dueDate),
  );
}
