"use client";

import { useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import UserNav from "@/components/layout/user-nav";
import WorkspaceSwitch from "@/components/layout/workspace-switch";
import GlobalNav from "@/components/layout/global-nav";
import { WorkspacesNav } from "@/components/layout/workspaces-nav";
import { WorkspaceNav } from "@/components/layout/workspace-nav";
import { AppNav } from "@/components/layout/app-nav";

// Un solo rail para las dos mitades de la app. Habia uno por ambito y acabaron divergiendo en lo
// que no debia cambiar —la cabecera, el orden de los grupos, hasta el nombre del import de
// UserNav—, que es lo que hacia que entrar en un espacio se sintiera como otra aplicacion.
// Lo unico que depende del ambito es el bloque del medio.
export function AppSidebar() {
  const { workspaceSlug } = useParams<{ workspaceSlug?: string }>();

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitch />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <GlobalNav />
            {workspaceSlug ? <WorkspaceNav workspaceSlug={workspaceSlug} /> : <WorkspacesNav />}
            <AppNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
