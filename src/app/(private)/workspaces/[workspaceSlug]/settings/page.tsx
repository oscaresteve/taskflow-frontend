"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { DeactivateWorkspaceSection } from "./_components/deactivate-workspace-section";
import { LeaveWorkspaceSection } from "./_components/leave-workspace-section";
import { WorkspaceNameSection } from "./_components/workspace-name-section";
import { WorkspaceDescriptionSection } from "./_components/workspace-description-section";
import { WorkspaceAvatarSection } from "./_components/workspace-avatar-section";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { isWorkspaceManager } from "@/lib/permissions/workspace-member-permissions";

export default function WorkspaceSettingsPage() {
  const t = useTranslations("workspaces");
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { role: myRole, isLoading } = useWorkspaceRole(workspaceSlug);

  if (isLoading) {
    return (
      <PageContainer className="max-w-5xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    );
  }

  // La pagina ya no se cierra en bloque a quien no gestiona: salir del espacio es justo lo que un
  // miembro raso necesita hacer aqui, asi que solo se condicionan las secciones de gestion.
  const canManage = isWorkspaceManager(myRole);

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("workspaceSettingsPage.title")} />
      {canManage && (
        <>
          <WorkspaceNameSection />
          <WorkspaceDescriptionSection />
          <WorkspaceAvatarSection />
        </>
      )}
      <LeaveWorkspaceSection />
      {canManage && <DeactivateWorkspaceSection />}
    </PageContainer>
  );
}
