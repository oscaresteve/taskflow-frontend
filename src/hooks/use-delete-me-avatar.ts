import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { deleteMeAvatar } from "@/lib/api/auth.api";
import { UserResponseDto } from "@/lib/dtos/auth.dto";

export function useDeleteMeAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMeAvatar(),
    onSuccess: () => {
      queryClient.setQueryData<UserResponseDto>(authKeys.me(), (old) => (old ? { ...old, avatarUrl: null } : old));
    },
  });
}
