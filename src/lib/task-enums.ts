import { ICONS } from "@/lib/icons";
import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskPriorities, taskStatuses } from "@/lib/schemas/task.schema";
import {
  neutralColors,
  statusDoneColors,
  statusInProgressColors,
  statusInReviewColors,
  statusTodoColors,
  severityCriticalColors,
  severityGoodColors,
  severitySeriousColors,
  severityWarningColors,
} from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";

export const statusOptions: Record<TaskStatus, EnumOption & { chartColor: string }> = {
  TODO: {
    labelKey: "tasks.status.TODO",
    icon: ICONS.statusTodo,
    colors: statusTodoColors,
    chartColor: "var(--status-todo)",
  },
  IN_PROGRESS: {
    labelKey: "tasks.status.IN_PROGRESS",
    icon: ICONS.statusInProgress,
    colors: statusInProgressColors,
    chartColor: "var(--status-in-progress)",
  },
  IN_REVIEW: {
    labelKey: "tasks.status.IN_REVIEW",
    icon: ICONS.statusInReview,
    colors: statusInReviewColors,
    chartColor: "var(--status-in-review)",
  },
  DONE: {
    labelKey: "tasks.status.DONE",
    icon: ICONS.statusDone,
    colors: statusDoneColors,
    chartColor: "var(--status-done)",
  },
};

export const priorityOptions: Record<TaskPriority, EnumOption & { chartColor: string }> = {
  LOW: {
    labelKey: "tasks.priority.LOW",
    icon: ICONS.priorityLow,
    colors: severityGoodColors,
    chartColor: "var(--severity-good)",
  },
  MEDIUM: {
    labelKey: "tasks.priority.MEDIUM",
    icon: ICONS.priorityMedium,
    colors: severityWarningColors,
    chartColor: "var(--severity-warning)",
  },
  HIGH: {
    labelKey: "tasks.priority.HIGH",
    icon: ICONS.priorityHigh,
    colors: severitySeriousColors,
    chartColor: "var(--severity-serious)",
  },
  URGENT: {
    labelKey: "tasks.priority.URGENT",
    icon: ICONS.priorityUrgent,
    colors: severityCriticalColors,
    chartColor: "var(--severity-critical)",
  },
};

// La fecha limite de las filas y tarjetas de solo lectura se pinta con el mismo lenguaje de icono
// que el estado y la prioridad (badge + tooltip) en vez de con los tres estados del date picker.
// Las tareas sin fecha no pintan badge.
export function getDueDateOption(overdue: boolean): EnumOption {
  if (overdue) return { labelKey: "tasks.fields.dueDate", icon: ICONS.overdue, colors: severityCriticalColors };

  return { labelKey: "tasks.fields.dueDate", icon: ICONS.dueDate, colors: neutralColors };
}

export const statusFilters = ["ALL", "OPEN", ...taskStatuses] as const;
export type StatusFilter = (typeof statusFilters)[number];

export const statusFilterOptions: Record<StatusFilter, EnumOption> = {
  ALL: {
    labelKey: "tasks.statusFilter.all",
    icon: ICONS.statusAll,
    colors: neutralColors,
  },
  // "OPEN" no es un estado del modelo sino todo lo que no esta DONE: es la lectura con la que se
  // habla de "tareas abiertas" en los overviews, y a este filtro enlazan sus contadores.
  OPEN: {
    labelKey: "tasks.statusFilter.open",
    icon: ICONS.statusOpen,
    colors: neutralColors,
  },
  ...statusOptions,
};

export const priorityFilters = ["ALL", ...taskPriorities] as const;
export type PriorityFilter = (typeof priorityFilters)[number];

export const priorityFilterOptions: Record<PriorityFilter, EnumOption> = {
  ALL: {
    labelKey: "tasks.priorityFilter.all",
    icon: ICONS.priorityAll,
    colors: neutralColors,
  },
  ...priorityOptions,
};

export const dueDateFilters = ["ALL", "OVERDUE", "THIS_WEEK", "NONE"] as const;
export type DueDateFilter = (typeof dueDateFilters)[number];

export const dueDateFilterOptions: Record<DueDateFilter, EnumOption> = {
  ALL: {
    labelKey: "tasks.dueDateFilter.all",
    icon: ICONS.dueDate,
    colors: neutralColors,
  },
  OVERDUE: {
    labelKey: "tasks.dueDateFilter.overdue",
    icon: ICONS.overdue,
    colors: severityCriticalColors,
  },
  THIS_WEEK: {
    labelKey: "tasks.dueDateFilter.thisWeek",
    icon: ICONS.dueDateThisWeek,
    colors: severityWarningColors,
  },
  NONE: {
    labelKey: "tasks.dueDateFilter.none",
    icon: ICONS.dueDateEmpty,
    colors: neutralColors,
  },
};

// Reparto de las tareas abiertas que pintan las tres vistas de overview. No son un filtro: el
// backend las devuelve ya contadas, y "scheduled" (con fecha, pero mas alla de esta semana) no
// tiene equivalente en el filtro de fecha limite de la lista y el kanban.
export const dueDateBuckets = ["overdue", "dueSoon", "scheduled", "noDueDate"] as const;
export type DueDateBucket = (typeof dueDateBuckets)[number];

export const dueDateBucketOptions: Record<DueDateBucket, EnumOption & { chartColor: string }> = {
  overdue: {
    labelKey: "tasks.dueDateBucket.overdue",
    icon: ICONS.overdue,
    colors: severityCriticalColors,
    chartColor: "var(--severity-critical)",
  },
  dueSoon: {
    labelKey: "tasks.dueDateBucket.dueSoon",
    icon: ICONS.dueDateThisWeek,
    colors: severityWarningColors,
    chartColor: "var(--severity-warning)",
  },
  scheduled: {
    labelKey: "tasks.dueDateBucket.scheduled",
    icon: ICONS.dueDate,
    colors: neutralColors,
    chartColor: "var(--chart-2)",
  },
  noDueDate: {
    labelKey: "tasks.dueDateBucket.noDueDate",
    icon: ICONS.dueDateEmpty,
    colors: neutralColors,
    chartColor: "var(--chart-1)",
  },
};

export const ALL_ASSIGNEES = "ALL";
export const UNASSIGNED = "UNASSIGNED";

export function resolveDefaultPriority(priority: PriorityFilter): TaskPriority {
  return priority === "ALL" ? "MEDIUM" : priority;
}

export function resolveDefaultAssignee(assigneeId: string): string | undefined {
  return assigneeId === ALL_ASSIGNEES || assigneeId === UNASSIGNED ? undefined : assigneeId;
}

export const taskSortFields = ["rank", "title", "status", "priority", "dueDate", "createdAt", "updatedAt"] as const;
export type TaskSortField = (typeof taskSortFields)[number];
