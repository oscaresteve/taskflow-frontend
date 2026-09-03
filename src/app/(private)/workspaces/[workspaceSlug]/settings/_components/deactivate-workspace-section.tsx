"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DangerSettingCard } from "@/components/common/danger-setting-card";
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
    <>
      <DangerSettingCard
        Icon={ShieldMinus}
        title="Deactivate workspace"
        description="This workspace will no longer be accessible to members."
        actionLabel="Deactivate"
        onAction={() => setDeactivateOpen(true)}
        pending={deactivateWorkspace.isPending}
      />
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
    </>
  );
}
