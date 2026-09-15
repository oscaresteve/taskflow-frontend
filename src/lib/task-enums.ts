import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpIcon,
  CircleAlertIcon,
  CircleCheckBigIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleEllipsisIcon,
  EqualIcon,
  type LucideIcon,
} from "lucide-react";
import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import {
  neutralColors,
  severityCriticalColors,
  severityGoodColors,
  severitySeriousColors,
  severityWarningColors,
} from "@/lib/enum-colors";
import type { EnumOption } from "@/lib/enum-option";
import tasks from "@/messages/en/tasks.json";

export const statusOptions: Record<TaskStatus, EnumOption & { chartColor: string }> = {
  TODO: {
    label: tasks.status.TODO,
    icon: CircleDashedIcon,
    colors: neutralColors,
    chartColor: "var(--chart-1)",
  },
  IN_PROGRESS: {
    label: tasks.status.IN_PROGRESS,
    icon: CircleDotDashedIcon,
    colors: neutralColors,
    chartColor: "var(--chart-2)",
  },
  IN_REVIEW: {
    label: tasks.status.IN_REVIEW,
    icon: CircleEllipsisIcon,
    colors: neutralColors,
    chartColor: "var(--chart-3)",
  },
  DONE: {
    label: tasks.status.DONE,
    icon: CircleCheckBigIcon,
    colors: neutralColors,
    chartColor: "var(--chart-4)",
  },
};

export const priorityOptions: Record<TaskPriority, EnumOption & { chartColor: string }> = {
  LOW: {
    label: tasks.priority.LOW,
    icon: ChevronDownIcon,
    colors: severityGoodColors,
    chartColor: "var(--severity-good)",
  },
  MEDIUM: {
    label: tasks.priority.MEDIUM,
    icon: EqualIcon,
    colors: severityWarningColors,
    chartColor: "var(--severity-warning)",
  },
  HIGH: {
    label: tasks.priority.HIGH,
    icon: ChevronUpIcon,
    colors: severitySeriousColors,
    chartColor: "var(--severity-serious)",
  },
  URGENT: {
    label: tasks.priority.URGENT,
    icon: ChevronsUpIcon,
    colors: severityCriticalColors,
    chartColor: "var(--severity-critical)",
  },
};

export const overdueIcon: LucideIcon = CircleAlertIcon;
