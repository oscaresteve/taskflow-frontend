"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { DeactivateWorkspaceSection } from "./_components/deactivate-workspace-section";
import { WorkspaceNameSection } from "./_components/workspace-name-section";
import { WorkspaceDescriptionSection } from "./_components/workspace-description-section";
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
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    );
  }

  if (!isWorkspaceManager(myRole)) {
    return <p className="p-6 text-sm text-muted-foreground">{t("workspaceSettingsPage.noPermission")}</p>;
  }

  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <PageHeader title={t("workspaceSettingsPage.title")} />
      <WorkspaceNameSection />
      <WorkspaceDescriptionSection />
      <DeactivateWorkspaceSection />
    </PageContainer>
  );
}
