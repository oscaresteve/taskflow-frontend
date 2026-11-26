"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { activityKeys } from "@/lib/query-keys/activity.keys";
import { notificationKeys } from "@/lib/query-keys/notification.keys";

// Cualquier mutacion puede dejar un evento de dominio, y de ese evento salen el historial y la
// campanita. Es una regla global, asi que vive aqui en vez de repetirse en cada hook: repetida, un
// hook nuevo se olvida de ella, y de hecho el contador de no leidas no la tenia en ninguno.
//
// No se devuelve la promesa a proposito: la mutacion no tiene que esperar a que se refresquen unos
// feeds que casi nunca estan montados.
function createQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: activityKeys.all });
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      },
    }),
  });

  return queryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
