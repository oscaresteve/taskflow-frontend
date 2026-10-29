import { ProjectRole } from "./project-members.dto";
import { UserSummaryResponseDto } from "./users.dto";

export type ProjectResponseDto = {
  id: string;

  name: string;
  slug: string;
  key: string;

  description: string | null;
  color: string | null;

  isArchived: boolean;
  isFavorite: boolean;

  // Mi rol en el proyecto, que viene en el listado para no preguntarlo por fila. null cuando no soy
  // miembro activo: entonces el mando, si lo hay, viene del rol de espacio.
  myRole: ProjectRole | null;

  createdAt: string;
  updatedAt: string;
};

// La fila del listado de gestion, igual que en espacios: de un proyecto archivado el listado de
// miembros responde 404, asi que sus responsables vienen con la fila.
export type ProjectListItemResponseDto = ProjectResponseDto & {
  owners: UserSummaryResponseDto[];
};
