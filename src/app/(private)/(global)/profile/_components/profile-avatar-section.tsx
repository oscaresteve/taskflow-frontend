"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SettingCard } from "@/components/common/setting-card";
import { AvatarPicker } from "@/components/common/avatar-picker";
import { toast } from "@/components/ui/toast";
import { useUploadMeAvatar } from "@/hooks/use-upload-me-avatar";
import { useDeleteMeAvatar } from "@/hooks/use-delete-me-avatar";
import { ApiError } from "@/lib/http/api-error";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { AVATAR_ACCEPTED_MIME_TYPES, MAX_AVATAR_SIZE_BYTES } from "@/lib/schemas/common.schema";
import { ICONS } from "@/lib/icons";
import { getFullName } from "@/lib/utils";

export function ProfileAvatarSection() {
  const t = useTranslations("profile");
  const { data: user, isLoading, isError } = useQuery(getMeQuery());
  const uploadAvatar = useUploadMeAvatar();
  const deleteAvatar = useDeleteMeAvatar();
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
    return <p className="text-sm text-muted-foreground">{t("avatarSection.failedToLoad")}</p>;
  }

  if (isLoading || !user) {
    return (
      <SettingCard
        title={t("avatarSection.title")}
        description={t("avatarSection.description")}
        action={<Skeleton className="size-16 rounded-full" />}
      />
    );
  }

  return (
    <>
      <SettingCard
        title={t("avatarSection.title")}
        description={t("avatarSection.description")}
        action={
          <AvatarPicker
            imageUrl={user.avatarUrl}
            seed={user.id}
            alt={getFullName(user.firstName, user.lastName)}
            variant="glyphs"
            acceptedMimeTypes={AVATAR_ACCEPTED_MIME_TYPES}
            maxSizeBytes={MAX_AVATAR_SIZE_BYTES}
            isUploading={uploadAvatar.isPending}
            onFileSelect={handleFileSelect}
          />
        }
        footerHint={t("avatarSection.footerHint")}
        // Quitar solo existe cuando hay algo que quitar: un menu de tres puntos con un unico
        // elemento, y encima deshabilitado la mitad del tiempo, era un nivel de mas.
        footerAction={
          user.avatarUrl && (
            <Button variant="destructive" onClick={() => setRemoveOpen(true)} disabled={deleteAvatar.isPending}>
              {t("avatarSection.removeAction")}
            </Button>
          )
        }
      />
      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title={t("avatarSection.removeDialogTitle")}
        description={t("avatarSection.removeDialogDescription")}
        confirmLabel={t("avatarSection.removeAction")}
        variant="destructive"
        onConfirm={handleRemove}
        pending={deleteAvatar.isPending}
        Icon={ICONS.delete}
      />
    </>
  );
}
