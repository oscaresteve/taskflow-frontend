"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useProjectRole } from "@/hooks/use-project-role";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { ProjectMemberWithUserResponseDto } from "@/lib/dtos/project-members.dto";
import { CommentList } from "./comment-list";
import { CommentForm } from "./comment-form";

interface CommentsSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  members: ProjectMemberWithUserResponseDto[];
}

export function CommentsSection({ workspaceSlug, projectSlug, taskNumber, members }: CommentsSectionProps) {
  const t = useTranslations("tasks");
  const { data: me } = useQuery(getMeQuery());
  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);

  return (
    <div className="flex flex-col gap-4 border-t pt-4">
      <h2 className="text-sm font-semibold">{t("comments.title")}</h2>
      <CommentList
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        taskNumber={taskNumber}
        members={members}
        meId={me?.id}
        canManageAny={isProjectManager(myRole)}
      />
      <CommentForm workspaceSlug={workspaceSlug} projectSlug={projectSlug} taskNumber={taskNumber} />
    </div>
  );
}
