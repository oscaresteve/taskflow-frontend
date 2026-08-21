"use client";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";

export default function ProjectsNav() {
  const pathname = usePathname();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const { data: projects, isLoading, isError } = useQuery(getProjectsQuery(workspaceSlug));
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <div className="flex items-center">
          <CollapsibleTrigger
            nativeButton={false}
            render={<SidebarGroupLabel className="flex-1 cursor-pointer" />}
          >
            Projects
            <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
          </CollapsibleTrigger>
          <SidebarGroupAction
            render={<Link href={`/workspaces/${workspaceSlug}/new-project`} />}
            title="New project"
            className="static top-auto right-auto"
          >
            <Plus />
            <span className="sr-only">New project</span>
          </SidebarGroupAction>
        </div>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {isError ? (
                <SidebarMenuItem>
                  <div className="flex h-8 items-center px-2 text-muted-foreground text-sm">
                    Failed to load projects
                  </div>
                </SidebarMenuItem>
              ) : isLoading || !projects ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="flex h-8 items-center gap-2 rounded-md px-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : (
                projects.data.map((project) => {
                  const href = `/workspaces/${workspaceSlug}/projects/${project.slug}`;
                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton isActive={isNavActive(pathname, href)} render={<Link href={href} />}>
                        {project.name}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
