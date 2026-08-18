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

  return (
    <Breadcrumb className="mx-4">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          {projectSlug || isNewProject ? (
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
              <BreadcrumbPage>{project?.name ?? projectSlug}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
