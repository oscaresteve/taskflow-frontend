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
import { useTranslations } from "next-intl";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const t = useTranslations("layout");
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug?: string; projectSlug?: string }>();

  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug ?? ""));
  const { data: project } = useQuery(
    getProjectQuery({ workspaceSlug: workspaceSlug ?? "", projectSlug: projectSlug ?? "" }),
  );

  if (!workspaceSlug) {
    const globalLabel =
      pathname === "/my-space" ? t("breadcrumb.mySpace")
      : pathname.startsWith("/profile") ? t("breadcrumb.profile")
      : pathname.startsWith("/preferences") ? t("breadcrumb.preferences")
      : pathname === "/workspaces" ? t("breadcrumb.workspaces")
      : null;

    if (!globalLabel) {
      return null;
    }

    return (
      <Breadcrumb className="mx-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{globalLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // La ultima miga es la vista abierta. Antes solo la ponian ajustes y miembros, asi que el tablero
  // y la lista se quedaban en el nombre del proyecto y la miga no decia donde estabas.
  const leafLabel =
    pathname.endsWith("/settings") ? t("breadcrumb.settings")
    : pathname.endsWith("/members") ? t("breadcrumb.members")
    : pathname.endsWith("/kanban") ? t("breadcrumb.kanban")
    : pathname.endsWith("/list") ? t("breadcrumb.list")
    : null;
  const hasMoreCrumbs = Boolean(leafLabel) || Boolean(projectSlug);

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
        {projectSlug && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {leafLabel ? (
                <BreadcrumbLink render={<Link href={`/workspaces/${workspaceSlug}/projects/${projectSlug}`} />}>
                  {project?.name ?? projectSlug}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{project?.name ?? projectSlug}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
        {leafLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{leafLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
