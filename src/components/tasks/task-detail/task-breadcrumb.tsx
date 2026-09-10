import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface TaskBreadcrumbProps {
  workspaceName: string;
  workspaceSlug: string;
  projectName: string;
  projectSlug: string;
  taskLabel: string;
}

export function TaskBreadcrumb({
  workspaceName,
  workspaceSlug,
  projectName,
  projectSlug,
  taskLabel,
}: TaskBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={`/workspaces/${workspaceSlug}`} />}>{workspaceName}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={`/workspaces/${workspaceSlug}/projects/${projectSlug}`} />}>
            {projectName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{taskLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
