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

export function FirstNameSection() {
  const t = useTranslations("profile");
  const { data: user, isLoading } = useQuery(getMeQuery());

  if (isLoading || !user) {
    return (
      <SettingCard
        title={t("firstNameSection.title")}
        description={t("firstNameSection.description")}
        action={<Skeleton className="h-8 w-56" />}
      />
    );
  }

  return <FirstNameEditor key={user.firstName} savedFirstName={user.firstName} />;
}

function FirstNameEditor({ savedFirstName }: { savedFirstName: string }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const updateName = useUpdateName();
  const [firstName, setFirstName] = useState(savedFirstName);

  const trimmed = firstName.trim();

  function handleSave() {
    if (trimmed === savedFirstName) return;

    updateName.mutate(
      { firstName: trimmed },
      {
        onSuccess: () => toast.add({ type: "success", description: t("firstNameSection.saved") }),
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
      title={t("firstNameSection.title")}
      description={t("firstNameSection.description")}
      footerAction={
        <Button onClick={handleSave} disabled={updateName.isPending || trimmed === savedFirstName}>
          {updateName.isPending && <ICONS.loading className="animate-spin" aria-hidden="true" />}
          {tCommon("actions.save")}
        </Button>
      }
      orientation="horizontal"
    >
      <Input
        id="firstName"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        disabled={updateName.isPending}
        autoComplete="given-name"
        aria-label={t("firstNameSection.title")}
        className="w-56"
      />
    </SettingCard>
  );
}
