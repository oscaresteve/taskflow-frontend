"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { signOut } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/http/api-error";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

export function OnboardingLogoutButton() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [logOutOpen, setLogOutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogOut() {
    setLoggingOut(true);
    try {
      await signOut();
      queryClient.clear();
      router.push("/auth/sign-in");
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("onboardingLogoutButton.genericError"),
        priority: "high",
      });
    }
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setLogOutOpen(true)}
              aria-label={t("onboardingLogoutButton.logOut")}
            />
          }
        >
          <LogOut />
        </TooltipTrigger>
        <TooltipContent>{t("onboardingLogoutButton.logOut")}</TooltipContent>
      </Tooltip>
      <ConfirmDialog
        open={logOutOpen}
        onOpenChange={setLogOutOpen}
        title={t("onboardingLogoutButton.logOut")}
        description={t("onboardingLogoutButton.confirmDescription")}
        confirmLabel={t("onboardingLogoutButton.logOut")}
        variant="destructive"
        onConfirm={handleLogOut}
        pending={loggingOut}
        Icon={LogOut}
      />
    </>
  );
}
