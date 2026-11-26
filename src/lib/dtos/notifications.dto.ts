import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";

// La notificacion no duplica el contenido: lleva su evento, y la frase la compone el mismo
// componente que el historial.
export type NotificationResponseDto = {
  id: string;

  readAt: string | null;

  createdAt: string;

  event: ActivityEventResponseDto;

  // La campanita es global, asi que cada entrada necesita saber a que espacio pertenece.
  workspaceSlug: string;
};

export type UnreadCountResponseDto = {
  unread: number;
};
