"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useLeaveWorkspace } from "@/hooks/use-leave-workspace";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { ApiError } from "@/lib/http/api-error";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { getWorkspaceMembersPageQuery } from "@/lib/queries/workspace-member.queries";
import { ConfirmDialog, richTitleTags } from "@/components/common/confirm-dialog";
import { DangerSettingCard } from "@/components/common/danger-setting-card";
import { SettingCard } from "@/components/common/setting-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ICONS } from "@/lib/icons";

export function LeaveWorkspaceSection() {
  const t = useTranslations("workspaces");
  const router = useRouter();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug));
  const { role: myRole } = useWorkspaceRole(workspaceSlug);
  const leaveWorkspace = useLeaveWorkspace(workspaceSlug);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const isOwner = myRole === "OWNER";

  // El ultimo propietario no puede salir, asi que se dice antes de que lo intente en vez de
  // dejarle chocar con el 409. Espeja la regla del backend, no la endurece. Solo hace falta el
  // numero, asi que se pide una pagina de uno y se lee el total; y solo si eres propietario,
  // porque para el resto la respuesta no cambia nada.
  const ownersQuery = useQuery({
    ...getWorkspaceMembersPageQuery({ workspaceSlug, status: ["ACTIVE"], role: "OWNER", limit: 1 }),
    enabled: !!workspaceSlug && isOwner,
  });

  const isLastOwner = ownersQuery.data?.pagination.total === 1;

  async function handleLeave() {
    try {
      await leaveWorkspace.mutateAsync();

      toast.add({
        type: "success",
        description: t("workspaceSettingsPage.leftToast", { name: workspace?.name ?? "" }),
      });

      // Navegacion obligatoria: el layout del espacio hace notFound() en cuanto se pierde el acceso.
      router.push("/my-space");
    } catch (error) {
      // El 409 del ultimo propietario ya no deberia llegar aqui, pero sigue siendo la red: entre
      // contar propietarios y confirmar, otro puede haber dejado de serlo.
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  // Mientras no puedas salir no hay nada peligroso que ofrecer, asi que la tarjeta no va en rojo:
  // lo util aqui es el camino para desbloquearse, no un boton muerto.
  if (isLastOwner) {
    return (
      <SettingCard
        title={t("leaveWorkspaceSection.title")}
        description={t("leaveWorkspaceSection.descriptionLastOwner")}
        footerAction={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/workspaces/${workspaceSlug}/members`} />}
          >
            {t("leaveWorkspaceSection.transferOwnershipLabel")}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <DangerSettingCard
        Icon={ICONS.logOut}
        title={t("leaveWorkspaceSection.title")}
        description={t("leaveWorkspaceSection.description")}
        actionLabel={t("leaveWorkspaceSection.actionLabel")}
        onAction={() => setLeaveOpen(true)}
        pending={leaveWorkspace.isPending}
      />
      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title={t.rich("leaveWorkspaceSection.dialogTitle", { name: workspace?.name ?? "", ...richTitleTags })}
        description={t("leaveWorkspaceSection.dialogDescription")}
        confirmLabel={t("leaveWorkspaceSection.confirmLabel")}
        variant="destructive"
        onConfirm={handleLeave}
        pending={leaveWorkspace.isPending}
        Icon={ICONS.logOut}
      />
    </>
  );
}
