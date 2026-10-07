import { ProjectRole } from "./project-members.dto";

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
