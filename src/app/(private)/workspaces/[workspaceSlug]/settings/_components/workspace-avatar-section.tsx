"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SettingCard } from "@/components/common/setting-card";
import { AvatarPicker } from "@/components/common/avatar-picker";
import { toast } from "@/components/ui/toast";
import { useUploadWorkspaceAvatar } from "@/hooks/use-upload-workspace-avatar";
import { useDeleteWorkspaceAvatar } from "@/hooks/use-delete-workspace-avatar";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { AVATAR_ACCEPTED_MIME_TYPES, MAX_AVATAR_SIZE_BYTES } from "@/lib/schemas/common.schema";
import { ICONS } from "@/lib/icons";

export function WorkspaceAvatarSection() {
  const t = useTranslations("workspaces");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace, isLoading, isError } = useQuery(getWorkspaceQuery(workspaceSlug));
  const uploadAvatar = useUploadWorkspaceAvatar(workspaceSlug);
  const deleteAvatar = useDeleteWorkspaceAvatar(workspaceSlug);
  const [removeOpen, setRemoveOpen] = useState(false);

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
      <SettingCard
        title={t("workspaceAvatarSection.title")}
        description={t("workspaceAvatarSection.description")}
        action={<Skeleton className="size-16 rounded-full" />}
      />
    );
  }

  return (
    <>
      <SettingCard
        title={t("workspaceAvatarSection.title")}
        description={t("workspaceAvatarSection.description")}
        action={
          <AvatarPicker
            imageUrl={workspace.avatarUrl}
            seed={workspace.id}
            alt={workspace.name}
            acceptedMimeTypes={AVATAR_ACCEPTED_MIME_TYPES}
            maxSizeBytes={MAX_AVATAR_SIZE_BYTES}
            isUploading={uploadAvatar.isPending}
            onFileSelect={handleFileSelect}
          />
        }
        footerHint={t("workspaceAvatarSection.footerHint")}
        // Quitar solo existe cuando hay algo que quitar, igual que en el perfil.
        footerAction={
          workspace.avatarUrl && (
            <Button variant="destructive" onClick={() => setRemoveOpen(true)} disabled={deleteAvatar.isPending}>
              {t("workspaceAvatarSection.removeAction")}
            </Button>
          )
        }
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
    </>
  );
}
