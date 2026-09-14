import { TaskPriority, TaskStatus, TaskResponseDto } from "@/lib/dtos/tasks.dto";

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

export type ProjectWorkloadItemDto = {
  projectId: string;
  name: string;
  slug: string;
  openTasksCount: number;
};

export type MemberWorkloadItemDto = {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  openTasksCount: number;
};

export type UrgencyBucket = "overdue" | "dueSoon" | "scheduled" | "noDueDate";

export type MyOverviewResponseDto = {
  tasks: {
    open: number;
    completedLast7Days: number;
    byUrgency: Record<UrgencyBucket, number>;
  };

  myTasks: OverviewTaskDto[];
};

export type WorkspaceOverviewResponseDto = {
  projectsCount: number;
  membersCount: number;

  tasks: {
    byStatus: Record<TaskStatus, number>;
    open: number;
    overdue: number;
    completedLast7Days: number;
    completionRate: number;
  };

  workload: ProjectWorkloadItemDto[];

  recentTasks: OverviewTaskDto[];
};

export type ProjectOverviewResponseDto = {
  tasks: {
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
    open: number;
    overdue: number;
    unassigned: number;
    completedLast7Days: number;
    completionRate: number;
  };

  workload: MemberWorkloadItemDto[];

  recentTasks: OverviewTaskDto[];
};
