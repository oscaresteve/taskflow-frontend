"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Archive } from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DangerSettingCard } from "@/components/common/danger-setting-card";
import { toast } from "@/components/ui/toast";
import { useArchiveProject } from "@/hooks/use-archive-project";
import { ApiError } from "@/lib/http/api-error";
import { getProjectQuery } from "@/lib/queries/project.queries";

export function ArchiveProjectSection() {
  const router = useRouter();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const archiveProject = useArchiveProject(workspaceSlug, projectSlug);
  const [archiveOpen, setArchiveOpen] = useState(false);

  async function handleArchive() {
    try {
      await archiveProject.mutateAsync();
      router.push(`/workspaces/${workspaceSlug}`);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  return (
    <>
      <DangerSettingCard
        Icon={Archive}
        title="Archive project"
        description="This project will no longer be accessible to members."
        actionLabel="Archive"
        onAction={() => setArchiveOpen(true)}
        pending={archiveProject.isPending}
      />
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={`Archive ${project?.name}?`}
        description="This will archive the project and hide it from all members. This action cannot be undone from the app."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveProject.isPending}
        Icon={Archive}
      />
    </>
  );
}
