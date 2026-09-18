import { ICONS } from "@/lib/icons";
import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import { taskPriorities } from "@/lib/schemas/task.schema";
import {
  neutralColors,
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
    colors: neutralColors,
    chartColor: "var(--chart-1)",
  },
  IN_PROGRESS: {
    labelKey: "tasks.status.IN_PROGRESS",
    icon: ICONS.statusInProgress,
    colors: neutralColors,
    chartColor: "var(--chart-2)",
  },
  IN_REVIEW: {
    labelKey: "tasks.status.IN_REVIEW",
    icon: ICONS.statusInReview,
    colors: neutralColors,
    chartColor: "var(--chart-3)",
  },
  DONE: {
    labelKey: "tasks.status.DONE",
    icon: ICONS.statusDone,
    colors: neutralColors,
    chartColor: "var(--chart-4)",
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

export const ALL_ASSIGNEES = "ALL";
export const UNASSIGNED = "UNASSIGNED";
