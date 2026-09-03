"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
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
    <Card className="ring-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Archive className="size-4" />
          Danger zone
        </CardTitle>
        <CardDescription>Irreversible and destructive actions.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="grid gap-1">
          <p className="text-sm font-medium">Archive project</p>
          <p className="text-sm text-muted-foreground">This project will no longer be accessible to members.</p>
        </div>
        <Button variant="destructive" onClick={() => setArchiveOpen(true)}>
          Archive
        </Button>
      </CardContent>
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
    </Card>
  );
}
