import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import tasks from "@/messages/en/tasks.json";

export const statusLabel: Record<TaskStatus, string> = tasks.status;

export const priorityVariant: Record<TaskPriority, "outline" | "secondary" | "destructive"> = {
  LOW: "outline",
  MEDIUM: "outline",
  HIGH: "secondary",
  URGENT: "destructive",
};
