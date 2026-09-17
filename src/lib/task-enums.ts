import { ICONS } from "@/lib/icons";
import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
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
