"use client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, Settings2 } from "lucide-react";
import { isNavActive } from "@/lib/nav";
import { useTranslations } from "next-intl";

type NavigationItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

export function AppNav() {
  const pathname = usePathname();
  const t = useTranslations("layout");

  const appNavigation: NavigationItem[] = [
    {
      name: t("appNav.preferences"),
      icon: Settings2,
      href: "/preferences",
    },
  ];

  return (
    <SidebarMenu>
      {appNavigation.map((nav) => {
        const Icon = nav.icon;
        const isActive = isNavActive(pathname, nav.href);
        return (
          <SidebarMenuItem key={nav.href}>
            <SidebarMenuButton render={<Link href={nav.href} />} isActive={isActive}>
              <Icon />
              {nav.name}
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
