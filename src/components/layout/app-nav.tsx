"use client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICONS, type Icon } from "@/lib/icons";
import { isNavActive } from "@/lib/nav";
import { useTranslations } from "next-intl";

type NavigationItem = {
  name: string;
  icon: Icon;
  href: string;
};

export function AppNav() {
  const pathname = usePathname();
  const t = useTranslations("layout");

  const appNavigation: NavigationItem[] = [
    {
      name: t("appNav.preferences"),
      icon: ICONS.preferences,
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
