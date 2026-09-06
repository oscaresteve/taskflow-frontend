export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

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

  createdAt: string;
  updatedAt: string;
};
