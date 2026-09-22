"use client";

import { ReactNode, useRef } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/toast";
import { ICONS } from "@/lib/icons";

interface AvatarPickerProps {
  imageUrl: string | null;
  fallback: ReactNode;
  alt: string;
  acceptedMimeTypes: readonly string[];
  maxSizeBytes: number;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
}

export function AvatarPicker({
  imageUrl,
  fallback,
  alt,
  acceptedMimeTypes,
  maxSizeBytes,
  isUploading = false,
  onFileSelect,
}: AvatarPickerProps) {
  const t = useTranslations("common");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite volver a elegir el mismo archivo si la subida falla

    if (!file) return;

    if (!acceptedMimeTypes.includes(file.type)) {
      toast.add({ type: "error", description: t("avatarPicker.invalidType"), priority: "high" });
      return;
    }

    if (file.size > maxSizeBytes) {
      toast.add({ type: "error", description: t("avatarPicker.tooLarge"), priority: "high" });
      return;
    }

    onFileSelect(file);
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("avatarPicker.changeAction")}
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-full disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Avatar size="lg" className="size-16! cursor-pointer transition-opacity hover:opacity-80">
          <AvatarImage src={imageUrl ?? undefined} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
            <ICONS.loading className="size-5 animate-spin" aria-hidden="true" />
          </div>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedMimeTypes.join(",")}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
