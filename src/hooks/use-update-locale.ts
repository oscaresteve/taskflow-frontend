import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { updateMe } from "@/lib/api/auth.api";
import type { Locale } from "@/lib/locale";

export function useUpdateLocale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locale: Locale) => updateMe({ locale }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
}
