"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceQuery } from "@/lib/queries/workspace.queries";
import { getProjectQuery } from "@/lib/queries/project.queries";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug?: string; projectSlug?: string }>();

  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug ?? ""));
  const { data: project } = useQuery(
    getProjectQuery({ workspaceSlug: workspaceSlug ?? "", projectSlug: projectSlug ?? "" }),
  );

  if (!workspaceSlug) {
    return null;
  }

  const isNewProject = !projectSlug && pathname.endsWith("/new-project");
  const isSettings = pathname.endsWith("/settings");
  const hasMoreCrumbs = isNewProject || isSettings || Boolean(projectSlug);

  return (
    <Breadcrumb className="mx-4">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          {hasMoreCrumbs ? (
            <BreadcrumbLink render={<Link href={`/workspaces/${workspaceSlug}`} />}>
              {workspace?.name ?? workspaceSlug}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{workspace?.name ?? workspaceSlug}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {isNewProject && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New project</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {projectSlug && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isSettings ? (
                <BreadcrumbLink render={<Link href={`/workspaces/${workspaceSlug}/projects/${projectSlug}`} />}>
                  {project?.name ?? projectSlug}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{project?.name ?? projectSlug}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {isSettings && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
