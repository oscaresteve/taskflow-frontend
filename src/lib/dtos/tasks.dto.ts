import { taskPriorities, taskStatuses } from "@/lib/schemas/task.schema";

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export type MoveTaskDto = {
  status: TaskStatus;
  afterTaskId: string | null;
};

export type TaskResponseDto = {
  id: string;
  projectId: string;

  createdById: string;
  assigneeId: string | null;

  taskNumber: number;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate: string | null;
  completedAt: string | null;

  rank: string;

  isArchived: boolean;
  isFavorite: boolean;

  createdAt: string;
  updatedAt: string;
};
