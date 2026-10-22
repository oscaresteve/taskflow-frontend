import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { updateMe } from "@/lib/api/auth.api";

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { firstName: string } | { lastName: string }) => updateMe(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
}
