"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ICONS } from "@/lib/icons";
import { isNavActive } from "@/lib/nav";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import ProjectsNav from "@/components/layout/projects-nav";

// Las secciones del espacio activo. Hermano de WorkspacesNav, que es la lista de espacios: el rail
// pinta una u otra segun haya ambito, y todo lo demas se queda igual al cruzar la frontera.
export function WorkspaceNav({ workspaceSlug }: { workspaceSlug: string }) {
  const pathname = usePathname();
  const t = useTranslations("layout");
  const overviewHref = `/workspaces/${workspaceSlug}`;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* Exact match, not isNavActive: every workspace subpage's pathname starts
              with overviewHref, so a prefix match would keep this active everywhere. */}
          <SidebarMenuButton
            render={<Link href={overviewHref} />}
            isActive={pathname === overviewHref}
            tooltip={t("workspaceNav.overview")}
          >
            <ICONS.overview />
            {t("workspaceNav.overview")}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Devuelve <ul>s sueltos, no un wrapper propio: va como hermano de los demas
          SidebarMenu dentro del div del grupo, nunca dentro de uno de ellos. */}
      <ProjectsNav />

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href={`${overviewHref}/members`} />}
            isActive={isNavActive(pathname, `${overviewHref}/members`)}
            tooltip={t("workspaceNav.members")}
          >
            <ICONS.members />
            {t("workspaceNav.members")}
          </SidebarMenuButton>
        </SidebarMenuItem>
        {/* Visible para cualquier miembro: ahi vive salir del espacio, y la propia pagina
            decide que secciones de gestion ensena segun el rol. */}
        <SidebarMenuItem>
          <SidebarMenuButton
            render={<Link href={`${overviewHref}/settings`} />}
            isActive={isNavActive(pathname, `${overviewHref}/settings`)}
            tooltip={t("workspaceNav.settings")}
          >
            <ICONS.settings />
            {t("workspaceNav.settings")}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
