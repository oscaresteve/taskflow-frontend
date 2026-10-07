"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { EmptyInline } from "@/components/common/empty-inline";
import { ActivityEntry, getTaskRef } from "@/components/activity/activity-entry";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { getNotificationsInfiniteQuery, getUnreadNotificationCountQuery } from "@/lib/queries/notification.queries";
import { useMarkAllNotificationsRead } from "@/hooks/use-mark-all-notifications-read";
import { useMarkNotificationRead } from "@/hooks/use-mark-notification-read";
import { NotificationResponseDto } from "@/lib/dtos/notifications.dto";
import { ApiError } from "@/lib/http/api-error";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

export function NotificationBell() {
  const t = useTranslations("notifications");
  const [open, setOpen] = useState(false);

  const { data: count } = useQuery(getUnreadNotificationCountQuery());
  const markAll = useMarkAllNotificationsRead();

  // La lista solo se pide al abrir el panel: el badge ya va por su cuenta en todas las paginas.
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...getNotificationsInfiniteQuery({ limit: PAGE_SIZE }),
    enabled: open,
  });

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unread = count?.unread ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon" aria-label={t("ariaLabel", { count: unread })} className="relative">
            <ICONS.notifications />
            {unread > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
                {unread > 9 ? "9+" : unread}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" initialFocus={false} className="w-96">
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>{t("title")}</PopoverTitle>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="-mr-2"
            >
              {t("markAllRead")}
            </Button>
          )}
        </PopoverHeader>

        <div className="-mx-2.5 flex max-h-96 flex-col gap-1 overflow-y-auto px-2.5">
          {isError ? (
            <p className="py-2 text-muted-foreground">{t("failedToLoad")}</p>
          ) : isLoading ? (
            <>
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </>
          ) : notifications.length === 0 ? (
            <EmptyInline icon={ICONS.notifications} label={t("empty")} className="py-4" />
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onOpenTask={() => setOpen(false)} />
              ))}

              {hasNextPage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="-mx-2.5 justify-start"
                >
                  {isFetchingNextPage ? t("loading") : t("loadMore")}
                </Button>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  notification,
  onOpenTask,
}: {
  notification: NotificationResponseDto;
  onOpenTask: () => void;
}) {
  const t = useTranslations("notifications");
  const router = useRouter();
  const markRead = useMarkNotificationRead();
  const taskRef = getTaskRef(notification.event);
  const project = notification.event.project;

  // La campanita es global, asi que el enlace se construye contra la pagina del proyecto del
  // evento en vez de sobre la ruta actual.
  const taskHref =
    taskRef && project
      ? buildTaskModalHref({
          pathname: `/workspaces/${notification.workspaceSlug}/projects/${project.slug}`,
          searchParams: new URLSearchParams(),
          workspaceSlug: notification.workspaceSlug,
          projectSlug: project.slug,
          taskNumber: taskRef.taskNumber,
        })
      : undefined;

  // Patron habitual: abrir la notificacion la marca como leida; el highlight solo indica estado.
  // Marcarla no bloquea la navegacion, asi que el error se avisa por callback y no esperandola.
  const handleOpen = () => {
    if (!notification.readAt) {
      markRead.mutate(notification.id, {
        onError: (error) =>
          toast.add({
            type: "error",
            description: error instanceof ApiError ? error.message : t("errors.generic"),
            priority: "high",
          }),
      });
    }

    if (taskHref) {
      router.push(taskHref);
      onOpenTask();
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      // El resaltado es el unico indicador de no leida, asi que solo lo llevan esas.
      className={cn(
        "min-w-0 cursor-pointer rounded-md px-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        !notification.readAt ? "bg-muted" : "hover:bg-muted/50",
      )}
    >
      <ActivityEntry event={notification.event} taskHref={taskHref} plainTaskRef />
    </button>
  );
}
