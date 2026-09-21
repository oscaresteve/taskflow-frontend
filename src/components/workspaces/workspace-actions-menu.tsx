"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";

type TriggerRenderProp = ComponentProps<typeof DropdownMenuTrigger>["render"];

interface WorkspaceActionsMenuProps {
  workspace: WorkspaceResponseDto;
  canManage: boolean;
  triggerRender?: TriggerRenderProp;
}

export function WorkspaceActionsMenu({ workspace, canManage, triggerRender }: WorkspaceActionsMenuProps) {
  const t = useTranslations("workspaces");
  const tCommon = useTranslations("common");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const deactivateWorkspace = useDeactivateWorkspace(workspace.slug);
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);

  async function handleDeactivate() {
    try {
      await deactivateWorkspace.mutateAsync();
      setDeactivateOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenuTrigger
                render={
                  triggerRender ?? (
                    <Button aria-label={t("workspaceActionsMenu.ariaLabel")} variant="ghost" size="icon-sm" />
                  )
                }
              />
            }
          >
            <ICONS.moreActions />
          </TooltipTrigger>
          <TooltipContent>{t("workspaceActionsMenu.ariaLabel")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-max">
          <DropdownMenuItem onClick={() => toggleFavorite.mutate(!workspace.isFavorite)} className="gap-2">
            <ICONS.favorite className={cn(workspace.isFavorite && "fill-current")} />
            {workspace.isFavorite ? tCommon("actions.removeFromFavorites") : tCommon("actions.addToFavorites")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}`} />}>
            <ICONS.openExternal />
            {t("workspaceActionsMenu.open")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/members`} />}>
            <ICONS.members />
            {t("workspaceActionsMenu.members")}
          </DropdownMenuItem>
          {canManage && (
            <DropdownMenuItem render={<Link href={`/workspaces/${workspace.slug}/settings`} />}>
              <ICONS.settings />
              {t("workspaceActionsMenu.settings")}
            </DropdownMenuItem>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setDeactivateOpen(true)}>
                <ICONS.deactivate />
                {t("workspaceActionsMenu.deactivate")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title={t.rich("workspaceActionsMenu.deactivateTitle", { name: workspace.name, ...richTitleTags })}
        description={t("workspaceActionsMenu.deactivateDescription")}
        confirmLabel={t("workspaceActionsMenu.deactivateConfirmLabel")}
        variant="destructive"
        onConfirm={handleDeactivate}
        pending={deactivateWorkspace.isPending}
        Icon={ICONS.deactivate}
      />
    </>
  );
}
