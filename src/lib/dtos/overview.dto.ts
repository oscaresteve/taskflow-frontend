import { TaskPriority, TaskStatus, TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { DueDateBucket } from "@/lib/task-enums";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";

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

// Numeros del proyecto en la rejilla del overview: lo que necesita su tarjeta para decir como va
// sin abrirlo. `lastActivityAt` es el ultimo cambio en cualquiera de sus tareas, null si no tiene.
export type ProjectStatsDto = {
  open: number;
  overdue: number;
  completionRate: number;
  lastActivityAt: string | null;
};

export type OverviewProjectDto = ProjectResponseDto & {
  stats: ProjectStatsDto;
};

// El espacio no reparte sus tareas en graficas: eso se ve dentro de cada proyecto, y cada proyecto
// trae sus propios numeros en el listado. Aqui solo van los cinco contadores de cabecera, la cola
// propia del usuario en este espacio y lo ultimo que se ha movido.
export type WorkspaceOverviewResponseDto = {
  projectsCount: number;

  tasks: {
    open: number;
    overdue: number;
    unassigned: number;
    completedLast7Days: number;
  };

  myTasks: OverviewTaskDto[];
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
