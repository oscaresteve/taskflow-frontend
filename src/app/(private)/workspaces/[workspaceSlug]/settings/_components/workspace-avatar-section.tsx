"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent, ActionsMenuItem } from "@/components/common/actions-menu";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SettingCard } from "@/components/common/setting-card";
import { AvatarPicker } from "@/components/common/avatar-picker";
import { toast } from "@/components/ui/toast";
import { useUploadWorkspaceAvatar } from "@/hooks/use-upload-workspace-avatar";
import { useDeleteWorkspaceAvatar } from "@/hooks/use-delete-workspace-avatar";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { AVATAR_ACCEPTED_MIME_TYPES, MAX_AVATAR_SIZE_BYTES } from "@/lib/schemas/common.schema";
import { getInitials } from "@/lib/utils";
import { ICONS } from "@/lib/icons";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function WorkspaceAvatarSection() {
  const t = useTranslations("workspaces");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const uploadAvatar = useUploadWorkspaceAvatar(workspaceSlug);
  const deleteAvatar = useDeleteWorkspaceAvatar(workspaceSlug);
  const [removeOpen, setRemoveOpen] = useState(false);
  const hasAvatar = workspace?.avatarUrl ? true : undefined;

  function handleFileSelect(file: File) {
    uploadAvatar.mutate(file, {
      onError: (error) => {
        toast.add({
          type: "error",
          description: error instanceof ApiError ? error.message : t("errors.generic"),
          priority: "high",
        });
      },
    });
  }

  async function handleRemove() {
    try {
      await deleteAvatar.mutateAsync();
      setRemoveOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{t("workspaceAvatarSection.failedToLoad")}</p>;
  }

  if (isLoading || !workspace) {
    return (
      <SettingCard title={t("workspaceAvatarSection.title")} description={t("workspaceAvatarSection.description")}>
        <Skeleton className="size-16 rounded-full" />
      </SettingCard>
    );
  }

  return (
    <SettingCard
      title={t("workspaceAvatarSection.title")}
      description={t("workspaceAvatarSection.description")}
      footerHint={t("workspaceAvatarSection.footerHint")}
      orientation="horizontal"
      footerAction={
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <DropdownMenuTrigger
                  render={
                    <Button
                      aria-label={t("workspaceAvatarSection.actionsLabel")}
                      variant="ghost"
                      size="icon-sm"
                      disabled={deleteAvatar.isPending}
                    />
                  }
                />
              }
            >
              <ICONS.moreActions />
            </TooltipTrigger>
            <TooltipContent>{t("workspaceAvatarSection.actionsLabel")}</TooltipContent>
          </Tooltip>

          <ActionsMenuContent align="end">
            <ActionsMenuItem variant="destructive" disabled={!hasAvatar} onClick={() => setRemoveOpen(true)}>
              <ICONS.delete />
              {t("workspaceAvatarSection.removeAction")}
            </ActionsMenuItem>
          </ActionsMenuContent>
        </DropdownMenu>
      }
    >
      <AvatarPicker
        imageUrl={workspace.avatarUrl}
        fallback={getInitials(workspace.name)}
        alt={workspace.name}
        acceptedMimeTypes={AVATAR_ACCEPTED_MIME_TYPES}
        maxSizeBytes={MAX_AVATAR_SIZE_BYTES}
        isUploading={uploadAvatar.isPending}
        onFileSelect={handleFileSelect}
      />
      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title={t("workspaceAvatarSection.removeDialogTitle")}
        description={t("workspaceAvatarSection.removeDialogDescription")}
        confirmLabel={t("workspaceAvatarSection.removeAction")}
        variant="destructive"
        onConfirm={handleRemove}
        pending={deleteAvatar.isPending}
        Icon={ICONS.delete}
      />
    </SettingCard>
  );
}
