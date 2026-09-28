import { request } from "@/lib/http/client";
import { buildQueryString } from "@/lib/http/query-string";
import { PaginatedResponseDto } from "@/lib/dtos/pagination.dto";
import { NotificationResponseDto, UnreadCountResponseDto } from "@/lib/dtos/notifications.dto";

export function getNotifications({ page, limit }: { page?: number; limit?: number }) {
  const queryString = buildQueryString({ page, limit });

  return request<PaginatedResponseDto<NotificationResponseDto>>(`/notifications${queryString}`, { method: "GET" });
}

export function getUnreadNotificationCount() {
  return request<UnreadCountResponseDto>("/notifications/unread-count", { method: "GET" });
}

export function markNotificationAsRead(notificationId: string) {
  return request<void>(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

export function markAllNotificationsAsRead() {
  return request<void>("/notifications/read-all", { method: "PATCH" });
}
