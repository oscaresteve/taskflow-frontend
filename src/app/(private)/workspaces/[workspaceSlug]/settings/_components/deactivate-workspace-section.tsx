"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("workspaces");
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
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <>
      <DangerSettingCard
        Icon={ShieldMinus}
        title={t("deactivateWorkspaceSection.title")}
        description={t("deactivateWorkspaceSection.description")}
        actionLabel={t("deactivateWorkspaceSection.actionLabel")}
        onAction={() => setDeactivateOpen(true)}
        pending={deactivateWorkspace.isPending}
      />
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={t("deactivateWorkspaceSection.dialogTitle", { name: workspace?.name ?? "" })}
        description={t("deactivateWorkspaceSection.dialogDescription")}
        confirmLabel={t("deactivateWorkspaceSection.confirmLabel")}
        variant="destructive"
        onConfirm={handleDeactivate}
        pending={deactivateWorkspace.isPending}
        Icon={ShieldMinus}
      />
    </>
  );
}
