"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ColorDot } from "@/components/ui/color-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumIconBadge } from "@/components/common/enum-display";
import { EmptyInline } from "@/components/common/empty-inline";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { getGlobalSearchQuery } from "@/lib/queries/search.queries";
import { getWorkspacesQuery } from "@/lib/queries/workspace.queries";
import { statusOptions } from "@/lib/task-enums";
import { ICONS } from "@/lib/icons";

const RESULTS_PER_ENTITY = 5;
const FAVORITES_LIMIT = 5;

export function CommandPalette() {
  const t = useTranslations("search");
  const { open, setOpen, close, search, setSearch } = useCommandPalette();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lo que el usuario ve escrito decide que se pinta; la version con debounce solo decide cuando se
  // pregunta al servidor.
  const trimmedSearch = search.trim();
  const debouncedSearch = useDebouncedValue(trimmedSearch);

  const {
    data: results,
    isFetching,
    isError,
    isPlaceholderData,
  } = useQuery({
    ...getGlobalSearchQuery({ search: debouncedSearch, limit: RESULTS_PER_ENTITY }),
    // El `enabled` del builder ya exige texto; aqui se le suma la paleta abierta, porque al cerrar
    // el texto se limpia de golpe y el valor con debounce tarda un poco mas en vaciarse.
    enabled: open && !!debouncedSearch,
  });

  // El estado vacio no necesita endpoint nuevo: los favoritos ya salen del listado de espacios.
  const { data: favorites } = useQuery({
    ...getWorkspacesQuery({ isFavorite: true, limit: FAVORITES_LIMIT, sort: "name", order: "asc" }),
    enabled: open && !trimmedSearch,
  });

  function go(href: string) {
    router.push(href);
    close();
  }

  const hasQuery = trimmedSearch.length > 0;
  // keepPreviousData deja en `results` la respuesta del termino anterior, y el debounce hace que el
  // termino consultado vaya por detras de lo escrito. Mientras alguna de las dos cosas pase, lo que
  // hay en cache no responde a lo que el usuario ve escrito: no se puede enseñar como si lo fuera.
  const isSearching = hasQuery && (trimmedSearch !== debouncedSearch || isFetching);
  const currentResults = isSearching || isError || isPlaceholderData ? undefined : results;
  const hasResults =
    !!currentResults &&
    currentResults.workspaces.length + currentResults.projects.length + currentResults.tasks.length > 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-96 justify-start text-muted-foreground font-normal"
        onClick={() => setOpen(true)}
      >
        <ICONS.search />
        {t("palette.trigger")}
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Se compone a mano en vez de usar CommandDialog: ese helper renderiza su DialogTitle
            fuera del DialogContent, o sea fuera del portal, y el popup de Base UI se queda sin
            nombre accesible (y el titulo se cuela en la pagina). */}
        <DialogContent showCloseButton={false} className="top-1/4 translate-y-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">{t("palette.title")}</DialogTitle>
          <DialogDescription className="sr-only">{t("palette.description")}</DialogDescription>

          {/* shouldFilter={false}: filtra el servidor. cmdk filtraria otra vez en cliente sobre el
              texto visible de cada fila y escondería lo que el backend encontro por descripcion. */}
          <Command shouldFilter={false}>
            <CommandInput autoFocus value={search} onValueChange={setSearch} placeholder={t("palette.placeholder")} />

            <CommandList>
              {hasQuery ? (
                <>
                  {isSearching && (
                    <div className="flex flex-col gap-1 p-1">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  )}

                  {!isSearching && isError && (
                    <EmptyInline icon={ICONS.info} label={t("palette.failed")} className="px-3 py-6 justify-center" />
                  )}

                  {!isSearching && !isError && !hasResults && (
                    <CommandEmpty>{t("palette.empty", { search: trimmedSearch })}</CommandEmpty>
                  )}

                  {currentResults && currentResults.workspaces.length > 0 && (
                    <CommandGroup heading={t("groups.workspaces")}>
                      {currentResults.workspaces.map((workspace) => (
                        <CommandItem
                          key={workspace.id}
                          value={`workspace:${workspace.id}`}
                          onSelect={() => go(`/workspaces/${workspace.slug}`)}
                        >
                          <CustomAvatar
                            size="sm"
                            avatarUrl={workspace.avatarUrl}
                            alt={workspace.name}
                            seed={workspace.id}
                          />
                          <span className="truncate">{workspace.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {currentResults && currentResults.projects.length > 0 && (
                    <CommandGroup heading={t("groups.projects")}>
                      {currentResults.projects.map((project) => (
                        <CommandItem
                          key={project.id}
                          value={`project:${project.id}`}
                          onSelect={() => go(`/workspaces/${project.workspace.slug}/projects/${project.slug}`)}
                        >
                          <ColorDot color={project.color} />
                          <span className="truncate">{project.name}</span>
                          <span className="truncate text-xs text-muted-foreground">{project.workspace.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {currentResults && currentResults.tasks.length > 0 && (
                    <CommandGroup heading={t("groups.tasks")}>
                      {currentResults.tasks.map((task) => (
                        <CommandItem
                          key={task.id}
                          value={`task:${task.id}`}
                          onSelect={() =>
                            go(
                              buildTaskModalHref({
                                pathname,
                                searchParams,
                                workspaceSlug: task.workspace.slug,
                                projectSlug: task.project.slug,
                                taskNumber: task.taskNumber,
                              }),
                            )
                          }
                        >
                          <EnumIconBadge option={statusOptions[task.status]} />
                          <span className="shrink-0 font-mono text-xs text-muted-foreground">
                            {task.project.key}-{task.taskNumber}
                          </span>
                          <span className="truncate">{task.title}</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {task.workspace.name} › {task.project.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              ) : (
                <>
                  <CommandGroup heading={t("groups.navigation")}>
                    <CommandItem value="go:my-space" onSelect={() => go("/my-space")}>
                      <ICONS.mySpace />
                      {t("commands.mySpace")}
                    </CommandItem>
                    <CommandItem value="go:workspaces" onSelect={() => go("/workspaces")}>
                      <ICONS.workspace />
                      {t("commands.manageWorkspaces")}
                    </CommandItem>
                    <CommandItem value="go:preferences" onSelect={() => go("/preferences")}>
                      <ICONS.preferences />
                      {t("commands.preferences")}
                    </CommandItem>
                  </CommandGroup>

                  {favorites && favorites.data.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup heading={t("groups.favorites")}>
                        {favorites.data.map((workspace) => (
                          <CommandItem
                            key={workspace.id}
                            value={`favorite:${workspace.id}`}
                            onSelect={() => go(`/workspaces/${workspace.slug}`)}
                          >
                            <CustomAvatar
                              size="sm"
                              avatarUrl={workspace.avatarUrl}
                              alt={workspace.name}
                              seed={workspace.id}
                            />
                            <span className="truncate">{workspace.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}

                  <EmptyInline icon={ICONS.search} label={t("palette.hint")} className="px-3 py-3" />
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
