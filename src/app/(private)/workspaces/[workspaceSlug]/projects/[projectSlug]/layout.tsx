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
    // min-h-full para que una vista pueda pedir el alto que sobra (el tablero lo hace) sin impedir
    // que las demas crezcan y hagan scroll en el SidebarInset, que es el contenedor de scroll.
    <div className="flex min-h-full flex-col">
      <PageContainer className="pb-0">
        <ProjectHeader workspaceSlug={workspaceSlug} projectSlug={projectSlug} />
      </PageContainer>
      {/* Las pestanas se quedan pegadas arriba al hacer scroll: son el unico modo de cambiar de
          vista, y antes desaparecian junto con el nombre del proyecto. El fondo y el borde viajan
          con ellas, de ancho completo, para que el contenido no se transparente por los lados. */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <PageContainer className="py-0 pt-4">
          <ProjectNavTabs />
        </PageContainer>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
