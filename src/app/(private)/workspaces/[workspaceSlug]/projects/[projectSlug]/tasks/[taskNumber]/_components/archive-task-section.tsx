"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { useArchiveTask } from "@/hooks/use-archive-task";
import { ApiError } from "@/lib/http/api-error";
import { getTaskQuery } from "@/lib/queries/task.queries";

export function ArchiveTaskSection() {
  const router = useRouter();
  const { workspaceSlug, projectSlug, taskNumber } = useParams<{
    workspaceSlug: string;
    projectSlug: string;
    taskNumber: string;
  }>();
  const { data: task } = useQuery(getTaskQuery({ workspaceSlug, projectSlug, taskNumber }));
  const archiveTask = useArchiveTask(workspaceSlug, projectSlug, taskNumber);
  const [archiveOpen, setArchiveOpen] = useState(false);

  async function handleArchive() {
    try {
      await archiveTask.mutateAsync();
      router.push(`/workspaces/${workspaceSlug}/projects/${projectSlug}`);
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
        <p className="text-sm font-medium">Archive task</p>
        <p className="text-sm text-muted-foreground">Archived tasks are hidden from the task list and can no longer be edited.</p>
      </div>
      {task?.isArchived ? (
        <span className="text-sm text-muted-foreground">Archived</span>
      ) : (
        <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
          Archive
        </Button>
      )}
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={`Archive ${task?.title}?`}
        description="This will archive the task and hide it from the task list. This action cannot be undone from the app."
        confirmLabel="Archive"
        variant="destructive"
        onConfirm={handleArchive}
        Icon={Archive}
      />
    </div>
  );
}
