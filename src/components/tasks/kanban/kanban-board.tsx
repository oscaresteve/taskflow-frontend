"use client";

import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { taskStatuses } from "@/lib/schemas/task.schema";
import { KanbanColumn } from "./kanban-column";

interface KanbanBoardProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  members: ProjectMemberWithUserResponseDto[];
}

export function KanbanBoard({ workspaceSlug, project, members }: KanbanBoardProps) {
  const assigneesById = new Map(members.map((member) => [member.userId, member.user]));

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {taskStatuses.map((status) => (
        <KanbanColumn
          key={status}
          workspaceSlug={workspaceSlug}
          projectSlug={project.slug}
          projectKey={project.key}
          status={status}
          assigneesById={assigneesById}
        />
      ))}
    </div>
  );
}
