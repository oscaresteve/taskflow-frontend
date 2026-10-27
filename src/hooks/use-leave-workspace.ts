import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveWorkspace } from "@/lib/api/workspace-members.api";
import { workspaceKeys } from "@/lib/query-keys/workspace.keys";
import { workspaceMemberKeys } from "@/lib/query-keys/workspace-member.keys";

export function useLeaveWorkspace(workspaceSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveWorkspace({ workspaceSlug }),
    onSuccess: async () => {
      // Se invalida `all` de las dos familias y no claves mas estrechas porque salir cambia a la vez
      // mi rol, el listado de miembros del espacio y mi lista de espacios (sidebar, selector y
      // /workspaces), y desde aqui no se sabe que paginas o filtros hay montados.
      await queryClient.invalidateQueries({ queryKey: workspaceMemberKeys.all });
      await queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}
