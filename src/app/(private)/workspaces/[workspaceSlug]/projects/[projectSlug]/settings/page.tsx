"use client";

import { useParams } from "next/navigation";
import { ArchiveProjectSection } from "./_components/archive-project-section";
import { EditProjectForm } from "./_components/edit-project-form";
import { PageContainer } from "@/components/common/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectRole } from "@/hooks/use-project-role";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";

export default function ProjectSettingsPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { role: myRole, isLoading } = useProjectRole(workspaceSlug, projectSlug);

  if (isLoading) {
    return (
      <PageContainer className="flex flex-col gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    );
  }

  if (!isProjectManager(myRole)) {
    return <p className="p-6 text-sm text-muted-foreground">You don&apos;t have permission to view this page.</p>;
  }

  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <EditProjectForm />
      <ArchiveProjectSection />
    </PageContainer>
  );
}
