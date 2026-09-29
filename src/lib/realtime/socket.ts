import { io, type Socket } from "socket.io-client";
import { apiOrigin } from "@/lib/config/env";
import { ActivityEventResponseDto } from "@/lib/dtos/activity.dto";
import { TaskStatus } from "@/lib/dtos/tasks.dto";

// Espejo de src/socket/realtime.ts del backend, misma convencion que lib/dtos con los DTO.
// Todo mensaje lleva el actor para poder ignorar los propios ecos.

export type ActivityNewMessage = {
  actorId: string;
  event: ActivityEventResponseDto;
};

export type TaskReorderedMessage = {
  actorId: string;
  taskId: string;
  status: TaskStatus;
  rank: string;
};

export type NotificationNewMessage = {
  actorId: string;
};

interface ServerToClientEvents {
  "activity:new": (message: ActivityNewMessage) => void;
  "task:reordered": (message: TaskReorderedMessage) => void;
  "notification:new": (message: NotificationNewMessage) => void;
}

interface ClientToServerEvents {
  "project:subscribe": (
    params: { workspaceSlug: string; projectSlug: string },
    ack?: (result: { ok: boolean }) => void,
  ) => void;
  "project:unsubscribe": () => void;
}

export type RealtimeSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: RealtimeSocket | null = null;

// Perezoso y sin autoConnect: quien lo monta decide cuando conectar, y asi importar este modulo no
// abre una conexion por si solo.
export function getSocket(): RealtimeSocket {
  socket ??= io(apiOrigin, { withCredentials: true, autoConnect: false });

  return socket;
}
