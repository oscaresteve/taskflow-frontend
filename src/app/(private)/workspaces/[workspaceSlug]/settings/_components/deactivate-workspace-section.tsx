"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ShieldMinus } from "lucide-react";
import { useState } from "react";

export function DeactivateWorkspaceSection() {
  const router = useRouter();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug));
  const deactivateWorkspace = useDeactivateWorkspace(workspaceSlug);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  async function handleDeactivate() {
    try {
      await deactivateWorkspace.mutateAsync();
      router.push("/home");
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
        <p className="text-sm font-medium">Deactivate workspace</p>
        <p className="text-sm text-muted-foreground">This workspace will no longer be accessible to members.</p>
      </div>
      <Button variant="destructive" onClick={() => setDeactivateOpen(true)}>
        Deactivate
      </Button>
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={`Deactivate ${workspace?.name}?`}
        description="This will deactivate the workspace and hide it from all members. This action cannot be undone from the
              app."
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleDeactivate}
        pending={deactivateWorkspace.isPending}
        Icon={ShieldMinus}
      />
    </div>
  );
}
