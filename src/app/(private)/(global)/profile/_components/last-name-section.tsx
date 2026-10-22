"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { SettingCard } from "@/components/common/setting-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useUpdateName } from "@/hooks/use-update-name";
import { ApiError } from "@/lib/http/api-error";

export function LastNameSection() {
  const t = useTranslations("profile");
  const { data: user, isLoading } = useQuery(getMeQuery());

  if (isLoading || !user) {
    return (
      <SettingCard
        title={t("lastNameSection.title")}
        description={t("lastNameSection.description")}
        action={<Skeleton className="h-8 w-56" />}
      />
    );
  }

  return <LastNameEditor key={user.lastName} savedLastName={user.lastName} />;
}

function LastNameEditor({ savedLastName }: { savedLastName: string }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const updateName = useUpdateName();
  const [lastName, setLastName] = useState(savedLastName);

  const trimmed = lastName.trim();

  function handleSave() {
    if (trimmed === savedLastName) return;

    updateName.mutate(
      { lastName: trimmed },
      {
        onSuccess: () => toast.add({ type: "success", description: t("lastNameSection.saved") }),
        onError: (error) => {
          toast.add({
            type: "error",
            description: error instanceof ApiError ? error.message : t("errors.generic"),
            priority: "high",
          });
        },
      },
    );
  }

  return (
    <SettingCard
      title={t("lastNameSection.title")}
      description={t("lastNameSection.description")}
      footerAction={
        <Button onClick={handleSave} disabled={updateName.isPending || trimmed === savedLastName}>
          {updateName.isPending && <ICONS.loading className="animate-spin" aria-hidden="true" />}
          {tCommon("actions.save")}
        </Button>
      }
      orientation="horizontal"
    >
      <Input
        id="lastName"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        disabled={updateName.isPending}
        autoComplete="family-name"
        aria-label={t("lastNameSection.title")}
        className="w-56"
      />
    </SettingCard>
  );
}
