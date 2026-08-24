import { notFound } from "next/navigation";
import { getProjectServer } from "@/lib/api/projects.server";
import { ProjectNavTabs } from "@/components/project-nav-tabs";
import { PageContainer } from "@/components/page-container";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/workspaces/[workspaceSlug]/projects/[projectSlug]">) {
  const { workspaceSlug, projectSlug } = await params;
  const project = await getProjectServer(workspaceSlug, projectSlug);
  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <PageContainer className="flex flex-col gap-4 pb-0">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback style={project.color ? { backgroundColor: project.color, color: "#fff" } : undefined}>
                {project.icon ?? getInitials(project.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{project.name}</h1>
                <Badge variant="secondary">{project.key}</Badge>
                {project.isArchived ? <Badge variant="outline">Archived</Badge> : null}
              </div>
              {project.description ? <p className="text-sm text-muted-foreground">{project.description}</p> : null}
            </div>
          </div>
          <ProjectNavTabs />
        </PageContainer>
      </div>
      {children}
    </div>
  );
}
