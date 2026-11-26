import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";

// Quien se puede mencionar en este proyecto, con los dos indices que hacen falta: por id para
// pintar una mencion guardada, y por username para convertir lo que se escribe en el editor.
// Los tres sitios que tocan menciones comparten la consulta y estos mapas.
export function useProjectMentionDirectory(workspaceSlug: string, projectSlug: string) {
  const { data: members } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));

  return useMemo(() => {
    const list = members ?? [];

    return {
      members: list,
      usernameById: new Map(list.map((member) => [member.userId, member.user.username])),
      idByUsername: new Map(list.map((member) => [member.user.username, member.userId])),
    };
  }, [members]);
}
