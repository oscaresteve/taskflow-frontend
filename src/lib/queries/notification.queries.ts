import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { notificationKeys } from "@/lib/query-keys/notification.keys";
import { getNotifications, getUnreadNotificationCount } from "@/lib/api/notifications.api";
import { getNextPageParam } from "@/lib/queries/pagination";

export const getNotificationsInfiniteQuery = ({ limit }: { limit?: number } = {}) =>
  infiniteQueryOptions({
    queryKey: notificationKeys.infiniteList({ limit }),
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam,
  });

// El badge vive en la cabecera de todas las paginas, asi que pide solo el numero y no una pagina
// entera de notificaciones.
export const getUnreadNotificationCountQuery = () =>
  queryOptions({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
  });
