"use client";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, LucideIcon } from "lucide-react";
import { isNavActive } from "@/lib/nav";
import { useTranslations } from "next-intl";

type NavigationItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

export default function GlobalNav() {
  const pathname = usePathname();
  const t = useTranslations("layout");

  const globalNavigation: NavigationItem[] = [
    {
      name: t("globalNav.mySpace"),
      icon: Rocket,
      href: "/my-space",
    },
  ];

  return (
    <SidebarMenu>
      {globalNavigation.map((nav) => {
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
