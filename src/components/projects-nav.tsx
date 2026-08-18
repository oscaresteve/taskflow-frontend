"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjectsQuery } from "@/lib/queries/project.queries";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectsNav() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: projects, isLoading, isError } = useQuery(getProjectsQuery(workspaceSlug));
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger nativeButton={false} render={<SidebarGroupLabel className="cursor-pointer" />}>
          Projects
          <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
        </CollapsibleTrigger>
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
                  const isActive = project.slug === projectSlug;
                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        render={<Link href={`/workspaces/${workspaceSlug}/projects/${project.slug}`} />}
                      >
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
