"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { useArchiveTask } from "@/hooks/use-archive-task";
import { ApiError } from "@/lib/http/api-error";
import { getTaskQuery } from "@/lib/queries/task.queries";
import { useTranslations } from "next-intl";

export function ArchiveTaskSection() {
  const router = useRouter();
  const t = useTranslations("tasks");
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
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <div className="flex max-w-sm items-center justify-between gap-4 rounded-lg border border-destructive/30 p-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium">{t("archiveTaskSection.title")}</p>
        <p className="text-sm text-muted-foreground">{t("archiveTaskSection.description")}</p>
      </div>
      {task?.isArchived ? (
        <span className="text-sm text-muted-foreground">{t("archiveTaskSection.archived")}</span>
      ) : (
        <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
          {t("archiveTaskSection.archive")}
        </Button>
      )}
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t("archiveTaskSection.confirmTitle", { taskTitle: task?.title ?? "" })}
        description={t("archiveTaskSection.confirmDescription")}
        confirmLabel={t("archiveTaskSection.archive")}
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveTask.isPending}
        Icon={Archive}
      />
    </div>
  );
}
