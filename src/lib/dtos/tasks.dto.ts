export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

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

  position: number;

  isArchived: boolean;

  createdAt: string;
  updatedAt: string;
};
