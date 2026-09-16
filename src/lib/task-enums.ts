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

export const statusOptions: Record<TaskStatus, EnumOption & { chartColor: string }> = {
  TODO: {
    labelKey: "tasks.status.TODO",
    icon: CircleDashedIcon,
    colors: neutralColors,
    chartColor: "var(--chart-1)",
  },
  IN_PROGRESS: {
    labelKey: "tasks.status.IN_PROGRESS",
    icon: CircleDotDashedIcon,
    colors: neutralColors,
    chartColor: "var(--chart-2)",
  },
  IN_REVIEW: {
    labelKey: "tasks.status.IN_REVIEW",
    icon: CircleEllipsisIcon,
    colors: neutralColors,
    chartColor: "var(--chart-3)",
  },
  DONE: {
    labelKey: "tasks.status.DONE",
    icon: CircleCheckBigIcon,
    colors: neutralColors,
    chartColor: "var(--chart-4)",
  },
};

export const priorityOptions: Record<TaskPriority, EnumOption & { chartColor: string }> = {
  LOW: {
    labelKey: "tasks.priority.LOW",
    icon: ChevronDownIcon,
    colors: severityGoodColors,
    chartColor: "var(--severity-good)",
  },
  MEDIUM: {
    labelKey: "tasks.priority.MEDIUM",
    icon: EqualIcon,
    colors: severityWarningColors,
    chartColor: "var(--severity-warning)",
  },
  HIGH: {
    labelKey: "tasks.priority.HIGH",
    icon: ChevronUpIcon,
    colors: severitySeriousColors,
    chartColor: "var(--severity-serious)",
  },
  URGENT: {
    labelKey: "tasks.priority.URGENT",
    icon: ChevronsUpIcon,
    colors: severityCriticalColors,
    chartColor: "var(--severity-critical)",
  },
};

export const overdueIcon: LucideIcon = CircleAlertIcon;
