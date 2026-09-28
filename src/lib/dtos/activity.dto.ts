import { TaskPriority, TaskStatus } from "@/lib/dtos/tasks.dto";
import { ProjectRole } from "@/lib/dtos/project-members.dto";

export const activityActions = [
  "TASK_CREATED",
  "TASK_EDITED",
  "TASK_STATUS_CHANGED",
  "TASK_PRIORITY_CHANGED",
  "TASK_ASSIGNEE_CHANGED",
  "TASK_DUE_DATE_CHANGED",
  "TASK_ARCHIVED",
  "COMMENT_CREATED",
  "PROJECT_MEMBER_ADDED",
  "PROJECT_MEMBER_ROLE_CHANGED",
  "PROJECT_MEMBER_DEACTIVATED",
] as const;

export type ActivityAction = (typeof activityActions)[number];

export type ActivityActorDto = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

type TaskRef = {
  taskNumber: number;
  taskTitle: string;
};

type MemberRef = {
  targetUserId: string;
};

export type TaskEditedField = "title" | "description";

// Espeja el payload del backend accion a accion. La union discriminada es lo que permite que el
// componente del feed estreche por action y lea los campos sin comprobaciones a mano.
export type ActivityPayloadMap = {
  TASK_CREATED: TaskRef;
  TASK_EDITED: TaskRef & { fields: TaskEditedField[] };
  TASK_STATUS_CHANGED: TaskRef & { from: TaskStatus; to: TaskStatus };
  TASK_PRIORITY_CHANGED: TaskRef & { from: TaskPriority; to: TaskPriority };
  TASK_ASSIGNEE_CHANGED: TaskRef & { from: string | null; to: string | null };
  TASK_DUE_DATE_CHANGED: TaskRef & { from: string | null; to: string | null };
  TASK_ARCHIVED: TaskRef;
  COMMENT_CREATED: TaskRef & { commentId: string };
  PROJECT_MEMBER_ADDED: MemberRef & { role: ProjectRole };
  PROJECT_MEMBER_ROLE_CHANGED: MemberRef & { from: ProjectRole; to: ProjectRole };
  PROJECT_MEMBER_DEACTIVATED: MemberRef;
};

export type ActivityEventResponseDto = {
  [A in ActivityAction]: {
    id: string;

    action: A;
    payload: ActivityPayloadMap[A];

    taskId: string | null;

    actor: ActivityActorDto;

    createdAt: string;
  };
}[ActivityAction];
