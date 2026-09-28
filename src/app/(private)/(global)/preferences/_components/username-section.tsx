"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { SettingCard } from "@/components/common/setting-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useUpdateUsername } from "@/hooks/use-update-username";
import { ApiError } from "@/lib/http/api-error";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function UsernameSection() {
  const t = useTranslations("preferences");
  const { data: user, isLoading } = useQuery(getMeQuery());

  if (isLoading || !user) {
    return (
      <SettingCard
        title={t("usernameSection.title")}
        description={t("usernameSection.description")}
        action={<Skeleton className="h-8 w-40" />}
      />
    );
  }

  return <UsernameEditor key={user.username} savedUsername={user.username} />;
}

function UsernameEditor({ savedUsername }: { savedUsername: string }) {
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");
  const updateUsername = useUpdateUsername();
  const [username, setUsername] = useState(savedUsername);

  const trimmed = username.trim().toLowerCase();

  function handleSave() {
    if (trimmed === savedUsername) return;

    updateUsername.mutate(trimmed, {
      onSuccess: () => toast.add({ type: "success", description: t("usernameSection.saved") }),
      onError: (error) => {
        toast.add({
          type: "error",
          description: error instanceof ApiError ? error.message : t("errors.generic"),
          priority: "high",
        });
      },
    });
  }

  return (
    <SettingCard
      title={t("usernameSection.title")}
      description={t("usernameSection.description")}
      footerAction={
        <Button onClick={handleSave} disabled={updateUsername.isPending || trimmed === savedUsername}>
          {updateUsername.isPending && <ICONS.loading className="animate-spin" aria-hidden="true" />}
          {tCommon("actions.save")}
        </Button>
      }
      orientation="horizontal"
    >
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <InputGroupInput
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={updateUsername.isPending}
          autoComplete="username"
          className="w-56"
        />
      </InputGroup>
    </SettingCard>
  );
}
