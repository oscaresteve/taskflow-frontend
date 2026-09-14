import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import tasks from "@/messages/en/tasks.json";

export const statusLabel: Record<TaskStatus, string> = tasks.status;

export const priorityLabel: Record<TaskPriority, string> = tasks.priority;

export const priorityVariant: Record<TaskPriority, "outline" | "secondary" | "destructive"> = {
  LOW: "outline",
  MEDIUM: "outline",
  HIGH: "secondary",
  URGENT: "destructive",
};

// Estado y prioridad son escalas con orden propio (una tarea avanza TODO -> DONE, la prioridad
// sube LOW -> URGENT), asi que en los graficos se pintan con la rampa ordinal de un solo tono
// --chart-1..4, no con colores de identidad: el lector ve el orden en el propio color.
export const statusChartColor: Record<TaskStatus, string> = {
  TODO: "var(--chart-1)",
  IN_PROGRESS: "var(--chart-2)",
  IN_REVIEW: "var(--chart-3)",
  DONE: "var(--chart-4)",
};

export const priorityChartColor: Record<TaskPriority, string> = {
  LOW: "var(--chart-1)",
  MEDIUM: "var(--chart-2)",
  HIGH: "var(--chart-3)",
  URGENT: "var(--chart-4)",
};
