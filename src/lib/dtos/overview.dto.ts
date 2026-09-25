import { TaskPriority, TaskStatus, TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { DueDateBucket } from "@/lib/task-enums";

export type OverviewTaskDto = TaskResponseDto & {
  project: {
    key: string;
    slug: string;
    name: string;
    workspaceSlug: string;
  };
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
};

// Reparto de las tareas abiertas por fecha limite; las cuatro cubetas suman siempre `open`.
export type DueDateBucketsDto = Record<DueDateBucket, number>;

export type MyOverviewResponseDto = {
  tasks: {
    open: number;
    completedLast7Days: number;
    byDueDate: DueDateBucketsDto;
  };

  myTasks: OverviewTaskDto[];
};

export type WorkspaceOverviewResponseDto = {
  projectsCount: number;

  tasks: {
    byStatus: Record<TaskStatus, number>;
    byDueDate: DueDateBucketsDto;
    open: number;
    completedLast7Days: number;
    completionRate: number;
  };

  recentTasks: OverviewTaskDto[];
};

export type ProjectOverviewResponseDto = {
  tasks: {
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    byDueDate: DueDateBucketsDto;
    open: number;
    unassigned: number;
    completedLast7Days: number;
    completionRate: number;
  };

  recentTasks: OverviewTaskDto[];
};
