import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { confirmMeAvatar, getMeAvatarUploadUrl } from "@/lib/api/auth.api";
import { compressImage } from "@/lib/compress-image";

export function useUploadMeAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // 0. Redimensionamos/recomprimimos en el navegador antes de subir nada.
      const optimizedFile = await compressImage(file);

      // 1. Pedimos al backend una URL de subida (PutObject) firmada y válida unos minutos.
      const { uploadUrl, key } = await getMeAvatarUploadUrl({
        contentType: optimizedFile.type,
        fileSize: optimizedFile.size,
      });

      // 2. Subimos el archivo directo al bucket (MinIO en dev, R2 en prod) con esa URL.
      // Esta petición no pasa por nuestra API.
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": optimizedFile.type },
        body: optimizedFile,
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload the file");
      }

      // 3. Confirmamos: el backend comprueba que el archivo existe de verdad y guarda la key.
      return confirmMeAvatar({ key });
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.me(), updatedUser);
    },
  });
}
