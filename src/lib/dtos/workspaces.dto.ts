import { WorkspaceRole } from "./workspace-members.dto";
import { UserSummaryResponseDto } from "./users.dto";

export type WorkspaceResponseDto = {
  id: string;

  name: string;
  slug: string;

  description: string | null;
  avatarUrl: string | null;

  isActive: boolean;
  isFavorite: boolean;

  // Mi rol en el espacio, que viene en el listado para no preguntarlo por fila. Nunca es null: todo
  // camino que devuelve un espacio exige pertenencia activa. Es lo unico que sirve en un espacio
  // desactivado, donde /members/me ya responde 404.
  myRole: WorkspaceRole;

  createdAt: string;
  updatedAt: string;
};

// La fila del listado de gestion. Los responsables vienen con ella en vez de pedirse por fila: de un
// espacio desactivado el listado de miembros responde 404, asi que preguntarlos dejaria la columna
// vacia justo en la pestana donde hace falta decidir si reactivarlo.
export type WorkspaceListItemResponseDto = WorkspaceResponseDto & {
  owners: UserSummaryResponseDto[];
};

export type WorkspaceAvatarUploadUrlResponseDto = {
  uploadUrl: string;
  key: string;
};
