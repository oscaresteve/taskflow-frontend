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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/http/api-error";
import { useArchiveProject } from "@/hooks/use-archive-project";
import { useToggleProjectFavorite } from "@/hooks/use-toggle-project-favorite";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";

type TriggerRenderProp = ComponentProps<typeof DropdownMenuTrigger>["render"];

interface ProjectActionsMenuProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  canManage: boolean;
  triggerRender?: TriggerRenderProp;
}

export function ProjectActionsMenu({ workspaceSlug, project, canManage, triggerRender }: ProjectActionsMenuProps) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const archiveProject = useArchiveProject(workspaceSlug, project.slug);
  const toggleFavorite = useToggleProjectFavorite(workspaceSlug, project.slug);

  async function handleArchive() {
    try {
      await archiveProject.mutateAsync();
      setArchiveOpen(false);
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
                    <Button variant="ghost" size="icon-sm" aria-label={t("projectActionsMenu.ariaLabel")} />
                  )
                }
              />
            }
          >
            <ICONS.moreActions />
          </TooltipTrigger>
          <TooltipContent>{t("projectActionsMenu.ariaLabel")}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="min-w-max">
          <DropdownMenuItem onClick={() => toggleFavorite.mutate(!project.isFavorite)} className="gap-2">
            <ICONS.favorite className={cn(project.isFavorite && "fill-current")} />
            {project.isFavorite ? tCommon("actions.removeFromFavorites") : tCommon("actions.addToFavorites")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`} />}>
            <ICONS.openExternal />
            {t("projectActionsMenu.open")}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}/members`} />}>
            <ICONS.members />
            {t("projectActionsMenu.members")}
          </DropdownMenuItem>
          {canManage && (
            <DropdownMenuItem render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}/settings`} />}>
              <ICONS.settings />
              {t("projectActionsMenu.settings")}
            </DropdownMenuItem>
          )}
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setArchiveOpen(true)}>
                <ICONS.archive />
                {t("projectActionsMenu.archive")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={t.rich("projectActionsMenu.confirmTitle", { projectName: project.name, ...richTitleTags })}
        description={t("projectActionsMenu.confirmDescription")}
        confirmLabel={t("projectActionsMenu.archive")}
        variant="destructive"
        onConfirm={handleArchive}
        pending={archiveProject.isPending}
        Icon={ICONS.archive}
      />
    </>
  );
}
