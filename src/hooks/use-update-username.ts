import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { updateMe } from "@/lib/api/auth.api";

export function useUpdateUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => updateMe({ username }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
}
