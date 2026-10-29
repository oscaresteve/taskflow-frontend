"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActionsMenuContent, ActionsMenuItem } from "@/components/common/actions-menu";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useDeactivateWorkspace } from "@/hooks/use-deactivate-workspace";
import { useReactivateWorkspace } from "@/hooks/use-reactivate-workspace";
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
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const deactivateWorkspace = useDeactivateWorkspace(workspace.slug);
  const reactivateWorkspace = useReactivateWorkspace(workspace.slug);
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);

  function reportError(error: unknown) {
    toast.add({
      type: "error",
      description: error instanceof ApiError ? error.message : t("errors.generic"),
      priority: "high",
    });
  }

  async function handleDeactivate() {
    try {
      await deactivateWorkspace.mutateAsync();
      setDeactivateOpen(false);
    } catch (error) {
      reportError(error);
    }
  }

  async function handleReactivate() {
    try {
      await reactivateWorkspace.mutateAsync();
      setReactivateOpen(false);
      toast.add({ type: "success", description: t("workspaceActionsMenu.reactivatedToast", { name: workspace.name }) });
    } catch (error) {
      reportError(error);
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
        <ActionsMenuContent align="start">
          {workspace.isActive ? (
            <>
              <ActionsMenuItem onClick={() => toggleFavorite.mutate(!workspace.isFavorite)}>
                <ICONS.favorite className={cn(workspace.isFavorite && "fill-current")} />
                {workspace.isFavorite ? tCommon("actions.removeFromFavorites") : tCommon("actions.addToFavorites")}
              </ActionsMenuItem>
              <ActionsMenuItem render={<Link href={`/workspaces/${workspace.slug}`} />}>
                <ICONS.openExternal />
                {t("workspaceActionsMenu.open")}
              </ActionsMenuItem>
              <ActionsMenuItem render={<Link href={`/workspaces/${workspace.slug}/members`} />}>
                <ICONS.members />
                {t("workspaceActionsMenu.members")}
              </ActionsMenuItem>
              <ActionsMenuItem render={<Link href={`/workspaces/${workspace.slug}/settings`} />}>
                <ICONS.settings />
                {t("workspaceActionsMenu.settings")}
              </ActionsMenuItem>
              {canManage && (
                <>
                  <DropdownMenuSeparator />
                  <ActionsMenuItem variant="destructive" onClick={() => setDeactivateOpen(true)}>
                    <ICONS.deactivate />
                    {t("workspaceActionsMenu.deactivate")}
                  </ActionsMenuItem>
                </>
              )}
            </>
          ) : (
            // De un espacio desactivado todo responde 404 menos su reactivacion, asi que ese es el
            // unico camino que se ofrece.
            <ActionsMenuItem disabled={!canManage} onClick={() => setReactivateOpen(true)}>
              <ICONS.reactivate />
              {t("workspaceActionsMenu.reactivate")}
            </ActionsMenuItem>
          )}
        </ActionsMenuContent>
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
      <ConfirmDialog
        open={reactivateOpen}
        onOpenChange={setReactivateOpen}
        title={t.rich("workspaceActionsMenu.reactivateTitle", { name: workspace.name, ...richTitleTags })}
        description={t("workspaceActionsMenu.reactivateDescription")}
        confirmLabel={t("workspaceActionsMenu.reactivateConfirmLabel")}
        onConfirm={handleReactivate}
        pending={reactivateWorkspace.isPending}
        Icon={ICONS.reactivate}
      />
    </>
  );
}
