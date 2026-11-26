type NotificationListParams = {
  limit?: number;
};

export const notificationKeys = {
  all: ["notifications"] as const,
  infiniteList: (params: NotificationListParams = {}) =>
    [...notificationKeys.all, "infinite-list", params] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
