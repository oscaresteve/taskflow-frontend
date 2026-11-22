"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ICONS } from "@/lib/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getWorkspacesInfiniteQuery } from "@/lib/queries/workspace.queries";
import { useToggleWorkspaceFavorite } from "@/hooks/use-toggle-workspace-favorite";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog";
import { WorkspaceActionsMenu } from "@/components/workspaces/workspace-actions-menu";
import { FavoriteToggle } from "@/components/common/favorite-toggle";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { EmptyInline } from "@/components/common/empty-inline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

const NAV_PAGE_SIZE = 5;

function WorkspaceNavItem({ workspace }: { workspace: WorkspaceResponseDto }) {
  const { role } = useWorkspaceRole(workspace.slug);
  const canManage = isWorkspaceManager(role);

  return (
    <SidebarMenuSubItem>
      <Tooltip>
        <TooltipTrigger
          render={
            <SidebarMenuSubButton
              render={<Link href={`/workspaces/${workspace.slug}`} />}
              className="has-[[data-workspace-actions]:hover]:bg-transparent"
            />
          }
        >
          <CustomAvatar size="sm" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
          <span className="truncate">{workspace.name}</span>
          <span
            data-workspace-actions
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="ml-auto shrink-0"
          >
            <WorkspaceActionsMenu
              workspace={workspace}
              canManage={canManage}
              triggerRender={<Button variant="ghost" size="icon-xs" className="text-muted-foreground" />}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="inline-end">{workspace.name}</TooltipContent>
      </Tooltip>
    </SidebarMenuSubItem>
  );
}

function WorkspaceFavoriteMenuItem({ workspace }: { workspace: WorkspaceResponseDto }) {
  const router = useRouter();
  const toggleFavorite = useToggleWorkspaceFavorite(workspace.slug);

  return (
    <Tooltip>
      <TooltipTrigger render={<DropdownMenuItem onClick={() => router.push(`/workspaces/${workspace.slug}`)} />}>
        <CustomAvatar size="sm" avatarUrl={workspace.avatarUrl} alt={workspace.name} seed={workspace.id} />
        <span className="truncate">{workspace.name}</span>
        <span onClick={(event) => event.stopPropagation()} className="ml-auto shrink-0">
          <FavoriteToggle
            isFavorite={workspace.isFavorite}
            onToggle={() => toggleFavorite.mutate(!workspace.isFavorite)}
          />
        </span>
      </TooltipTrigger>

      <TooltipContent side="inline-end">{workspace.name}</TooltipContent>
    </Tooltip>
  );
}

function WorkspacesFavoritesNav() {
  const t = useTranslations("layout");
  const { data } = useInfiniteQuery(getWorkspacesInfiniteQuery({ limit: NAV_PAGE_SIZE, isFavorite: true }));
  const favorites = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton tooltip={t("workspacesNav.favorites")} />}>
            <ICONS.favorite className="size-4 shrink-0" />
            {t("workspacesNav.favorites")}
            <ICONS.chevronRight className="ml-auto size-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="min-w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("workspacesNav.favorites")}</DropdownMenuLabel>
              {favorites.length === 0 ? (
                <EmptyInline icon={ICONS.favorite} label={t("workspacesNav.noFavorites")} className="h-9 px-2" />
              ) : (
                favorites.map((workspace) => <WorkspaceFavoriteMenuItem key={workspace.id} workspace={workspace} />)
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function WorkspacesNav() {
  // Por `updatedAt` y no por nombre: los primeros del alfabeto no significan nada. Ojo con el
  // criterio: `updatedAt` solo se mueve al editar el proyecto o al crear una tarea (incrementa
  // nextTaskNumber), no con el trabajo diario. Es lo mas cercano a "reciente" sin tocar backend.
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    getWorkspacesInfiniteQuery({ limit: NAV_PAGE_SIZE, sort: "updatedAt", order: "desc" }),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const activeWorkspaces = data?.pages.flatMap((page) => page.data) ?? [];
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - activeWorkspaces.length : 0;
  const t = useTranslations("layout");
  // Exacta: /workspaces/<slug> es un espacio concreto, no el directorio.
  const isDirectoryActive = usePathname() === "/workspaces";

  return (
    <>
      <WorkspacesFavoritesNav />

      <SidebarMenu>
        <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
          {/* La fila es el enlace al indice, no el desplegable: el rail ensena un acceso corto y
              la lista completa, con su busqueda y sus filtros, vive en la pagina. Plegado el rail
              queda solo este boton, que sigue llevando al indice. */}
          <SidebarMenuButton
            render={<Link href="/workspaces" />}
            isActive={isDirectoryActive}
            tooltip={t("workspacesNav.title")}
          >
            <ICONS.workspace />
            {t("workspacesNav.title")}
          </SidebarMenuButton>

          <CollapsibleTrigger
            render={<SidebarMenuAction aria-label={t("workspacesNav.toggleList")} />}
          >
            <ICONS.expand className="transition-transform group-data-open/collapsible:rotate-180" />
          </CollapsibleTrigger>

          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarMenuAction
                  onClick={() => setCreateOpen(true)}
                  className="right-7"
                  aria-label={t("workspacesNav.newWorkspace")}
                />
              }
            >
              <ICONS.addNew />
            </TooltipTrigger>
            <TooltipContent>{t("workspacesNav.newWorkspace")}</TooltipContent>
          </Tooltip>

          <CollapsibleContent>
            <SidebarMenuSub>
              {isError ? (
                <SidebarMenuSubItem>
                  <div className="flex h-7 items-center px-2 text-muted-foreground text-sm">
                    {t("workspacesNav.failedToLoad")}
                  </div>
                </SidebarMenuSubItem>
              ) : isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <div className="flex h-7 items-center gap-2 rounded-md px-2">
                      <Skeleton className="size-4 rounded-md" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuSubItem>
                ))
              ) : activeWorkspaces.length === 0 ? (
                <SidebarMenuSubItem>
                  <EmptyInline
                    icon={ICONS.workspace}
                    label={t("workspacesNav.noneYet")}
                    className="h-7 px-2"
                  />
                </SidebarMenuSubItem>
              ) : (
                <>
                  {activeWorkspaces.map((workspace) => (
                    <WorkspaceNavItem key={workspace.id} workspace={workspace} />
                  ))}

                  {/* Cuantos quedan y la forma de traerlos, sin buscador: la busqueda vive en el
                      indice, al que lleva la fila de la seccion. */}
                  {hasNextPage && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        onClick={() => !isFetchingNextPage && fetchNextPage()}
                        aria-disabled={isFetchingNextPage}
                        className="cursor-pointer text-muted-foreground"
                      >
                        {isFetchingNextPage
                          ? t("workspacesNav.loading")
                          : t("workspacesNav.remaining", { count: remaining })}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
