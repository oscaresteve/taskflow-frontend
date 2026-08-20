"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
    <div className="flex max-w-sm items-center justify-between gap-4 rounded-lg border border-destructive/30 p-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium">Archive project</p>
        <p className="text-sm text-muted-foreground">This project will no longer be accessible to members.</p>
      </div>
      <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
        Archive
      </Button>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={`Archive ${project?.name}?`}
        description="This will archive the project and hide it from all members. This action cannot be undone from the app."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleArchive}
        Icon={Archive}
      />
    </div>
  );
}
