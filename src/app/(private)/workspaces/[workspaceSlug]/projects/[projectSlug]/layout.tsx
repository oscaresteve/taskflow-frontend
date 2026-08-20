import { notFound } from "next/navigation";
import { getProjectServer } from "@/lib/api/projects.server";

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/workspaces/[workspaceSlug]/projects/[projectSlug]">) {
  const { workspaceSlug, projectSlug } = await params;
  const project = await getProjectServer(workspaceSlug, projectSlug);
  if (!project) {
    notFound();
  }

  return children;
}
