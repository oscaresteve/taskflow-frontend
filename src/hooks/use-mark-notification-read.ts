import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/lib/api/notifications.api";
import { notificationKeys } from "@/lib/query-keys/notification.keys";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
