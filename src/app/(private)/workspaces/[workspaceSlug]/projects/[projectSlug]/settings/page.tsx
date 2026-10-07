"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArchiveProjectSection } from "./_components/archive-project-section";
import { ProjectNameSection } from "./_components/project-name-section";
import { ProjectDescriptionSection } from "./_components/project-description-section";
import { ProjectColorSection } from "./_components/project-color-section";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectRole } from "@/hooks/use-project-role";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { canManageProject } from "@/lib/permissions/project-member-permissions";

export default function ProjectSettingsPage() {
  const t = useTranslations("projects");
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { role: myRole, isLoading } = useProjectRole(workspaceSlug, projectSlug);
  const { role: myWorkspaceRole, isLoading: isLoadingWorkspaceRole } = useWorkspaceRole(workspaceSlug);

  if (isLoading || isLoadingWorkspaceRole) {
    return (
      <PageContainer className="max-w-5xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    );
  }

  if (!canManageProject({ workspaceRole: myWorkspaceRole, projectRole: myRole })) {
    return <p className="p-6 text-sm text-muted-foreground">{t("projectSettingsPage.noPermission")}</p>;
  }

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("projectSettingsPage.title")} />
      <ProjectNameSection />
      <ProjectDescriptionSection />
      <ProjectColorSection />
      <ArchiveProjectSection />
    </PageContainer>
  );
}
