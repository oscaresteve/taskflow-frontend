import { notFound } from "next/navigation";
import { getProjectServer } from "@/lib/api/projects.server";
import { ProjectNavTabs } from "@/components/layout/project-nav-tabs";
import { PageContainer } from "@/components/common/page-container";
import { ProjectHeader } from "./_components/project-header";

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/workspaces/[workspaceSlug]/projects/[projectSlug]">) {
  const { workspaceSlug, projectSlug } = await params;
  const project = await getProjectServer({ workspaceSlug, projectSlug });
  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <PageContainer className="flex flex-col gap-4 pb-0">
          <ProjectHeader workspaceSlug={workspaceSlug} projectSlug={projectSlug} />
          <ProjectNavTabs />
        </PageContainer>
      </div>
      {children}
    </div>
  );
}
