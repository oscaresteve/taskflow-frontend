import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { confirmWorkspaceAvatar, getWorkspaceAvatarUploadUrl } from "@/lib/api/workspaces.api";

export function useUploadWorkspaceAvatar(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // 1. Pedimos al backend una URL de subida (PutObject) firmada y válida unos minutos.
      const { uploadUrl, key } = await getWorkspaceAvatarUploadUrl({
        workspaceSlug,
        contentType: file.type,
        fileSize: file.size,
      });

      // 2. Subimos el archivo directo al bucket (MinIO en dev, R2 en prod) con esa URL.
      // Esta petición no pasa por nuestra API.
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload the file");
      }

      // 3. Confirmamos: el backend comprueba que el archivo existe de verdad y guarda la key.
      return confirmWorkspaceAvatar({ workspaceSlug, key });
    },
    onSuccess: async (updatedWorkspace) => {
      queryClient.setQueryData(workspaceKeys.detail(workspaceSlug), updatedWorkspace);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.infiniteList() }),
      ]);
    },
  });
}
