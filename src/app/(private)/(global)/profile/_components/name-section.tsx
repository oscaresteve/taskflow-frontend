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

export function NameSection() {
  const t = useTranslations("profile");
  const { data: user, isLoading } = useQuery(getMeQuery());

  if (isLoading || !user) {
    return (
      <SettingCard title={t("nameSection.title")} description={t("nameSection.description")}>
        <Skeleton className="h-8 w-full" />
      </SettingCard>
    );
  }

  return (
    <NameEditor
      key={`${user.firstName}/${user.lastName}`}
      savedFirstName={user.firstName}
      savedLastName={user.lastName}
    />
  );
}

// Nombre y apellidos son un solo ajuste y un solo PATCH, asi que comparten tarjeta y boton: dos
// tarjetas con dos Guardar para el mismo endpoint hacian parecer que eran dos datos distintos.
function NameEditor({ savedFirstName, savedLastName }: { savedFirstName: string; savedLastName: string }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const updateName = useUpdateName();
  const [firstName, setFirstName] = useState(savedFirstName);
  const [lastName, setLastName] = useState(savedLastName);

  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const isDirty = trimmedFirstName !== savedFirstName || trimmedLastName !== savedLastName;

  function handleSave() {
    if (!isDirty) return;

    updateName.mutate(
      { firstName: trimmedFirstName, lastName: trimmedLastName },
      {
        onSuccess: () => toast.add({ type: "success", description: t("nameSection.saved") }),
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
      title={t("nameSection.title")}
      description={t("nameSection.description")}
      footerAction={
        <Button onClick={handleSave} disabled={updateName.isPending || !isDirty}>
          {updateName.isPending && <ICONS.loading className="animate-spin" aria-hidden="true" />}
          {tCommon("actions.save")}
        </Button>
      }
    >
      <div className="flex gap-2">
        <Input
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          disabled={updateName.isPending}
          autoComplete="given-name"
          aria-label={t("nameSection.firstNameLabel")}
          placeholder={t("nameSection.firstNameLabel")}
          className="min-w-0 flex-1"
        />
        <Input
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          disabled={updateName.isPending}
          autoComplete="family-name"
          aria-label={t("nameSection.lastNameLabel")}
          placeholder={t("nameSection.lastNameLabel")}
          className="min-w-0 flex-1"
        />
      </div>
    </SettingCard>
  );
}
