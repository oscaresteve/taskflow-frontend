"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getSocket, type ActivityNewMessage } from "@/lib/realtime/socket";
import { refreshSession } from "@/lib/http/client";
import { authKeys } from "@/lib/query-keys/auth.keys";
import { activityKeys } from "@/lib/query-keys/activity.keys";
import { notificationKeys } from "@/lib/query-keys/notification.keys";
import { taskKeys } from "@/lib/query-keys/task.keys";
import { commentKeys } from "@/lib/query-keys/comment.keys";
import { projectKeys } from "@/lib/query-keys/project.keys";
import { projectMemberKeys } from "@/lib/query-keys/project-member.keys";
import { UserResponseDto } from "@/lib/dtos/auth.dto";

// Lo que llega por socket se invalida, nunca se escribe en la cache: asi el mensaje puede ser pobre
// y la verdad sigue viniendo del endpoint.
function invalidateForActivity(queryClient: QueryClient, event: ActivityNewMessage["event"]) {
  queryClient.invalidateQueries({ queryKey: activityKeys.all });

  switch (event.action) {
    case "TASK_CREATED":
    case "TASK_EDITED":
    case "TASK_STATUS_CHANGED":
    case "TASK_PRIORITY_CHANGED":
    case "TASK_ASSIGNEE_CHANGED":
    case "TASK_DUE_DATE_CHANGED":
    case "TASK_ARCHIVED":
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      return;

    case "COMMENT_CREATED":
    case "COMMENT_EDITED":
    case "COMMENT_DELETED":
    case "COMMENT_MENTIONED":
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      return;

    case "PROJECT_CREATED":
    case "PROJECT_UPDATED":
    case "PROJECT_ARCHIVED":
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      return;

    case "PROJECT_MEMBER_ADDED":
    case "PROJECT_MEMBER_ROLE_CHANGED":
    case "PROJECT_MEMBER_DEACTIVATED":
      queryClient.invalidateQueries({ queryKey: projectMemberKeys.all });
      return;

    // Los eventos de espacio no tienen sala, asi que no llegan por aqui.
    default:
      return;
  }
}

export function RealtimeBridge() {
  const queryClient = useQueryClient();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug?: string; projectSlug?: string }>();

  // Conexion y escucha. El usuario se lee de la cache dentro del handler para no tener que
  // reregistrar los listeners cada vez que cambie.
  useEffect(() => {
    const socket = getSocket();

    const isOwnEcho = (actorId: string) =>
      actorId === queryClient.getQueryData<UserResponseDto>(authKeys.me())?.id;

    const onActivity = (message: ActivityNewMessage) => {
      if (isOwnEcho(message.actorId)) return;

      invalidateForActivity(queryClient, message.event);
    };

    const onTaskReordered = (message: { actorId: string }) => {
      if (isOwnEcho(message.actorId)) return;

      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    };

    const onNotification = (message: { actorId: string }) => {
      if (isOwnEcho(message.actorId)) return;

      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    };

    const onConnectError = async (error: Error & { data?: { code?: string } }) => {
      // socket.active sigue en true mientras socket.io reintenta por su cuenta; solo hay que actuar
      // cuando nos ha rechazado el middleware del handshake.
      if (socket.active || error.data?.code !== "UNAUTHORIZED") return;

      try {
        await refreshSession();
        socket.connect();
      } catch {
        // Un socket de fondo no debe provocar una navegacion dura: ya redirigira la siguiente
        // peticion HTTP cuando falle su propio refresh.
      }
    };

    socket.on("activity:new", onActivity);
    socket.on("task:reordered", onTaskReordered);
    socket.on("notification:new", onNotification);
    socket.on("connect_error", onConnectError);

    socket.connect();

    return () => {
      socket.off("activity:new", onActivity);
      socket.off("task:reordered", onTaskReordered);
      socket.off("notification:new", onNotification);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, [queryClient]);

  // Sala del proyecto que se esta viendo.
  useEffect(() => {
    if (!workspaceSlug || !projectSlug) return;

    const socket = getSocket();
    const subscribe = () => socket.emit("project:subscribe", { workspaceSlug, projectSlug });

    // Tras reconectar el servidor tiene un socket nuevo sin salas, asi que hay que volver a entrar.
    socket.on("connect", subscribe);
    if (socket.connected) subscribe();

    return () => {
      socket.off("connect", subscribe);
      socket.emit("project:unsubscribe");
    };
  }, [workspaceSlug, projectSlug]);

  return null;
}
