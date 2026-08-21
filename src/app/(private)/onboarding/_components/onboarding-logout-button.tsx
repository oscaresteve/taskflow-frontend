"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { signOut } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/http/api-error";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function OnboardingLogoutButton() {
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
        description: error instanceof ApiError ? error.message : "Something went wrong",
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
              aria-label="Log out"
            />
          }
        >
          <LogOut />
        </TooltipTrigger>
        <TooltipContent>Log out</TooltipContent>
      </Tooltip>
      <ConfirmDialog
        open={logOutOpen}
        onOpenChange={setLogOutOpen}
        title="Log out"
        description="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmLabel="Log out"
        variant="destructive"
        onConfirm={handleLogOut}
        pending={loggingOut}
        Icon={LogOut}
      />
    </>
  );
}
