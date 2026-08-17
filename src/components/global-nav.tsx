"use client";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LucideIcon } from "lucide-react";

type NavigationItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

const globalNavigation: NavigationItem[] = [
  {
    name: "Home",
    icon: Home,
    href: "/home",
  },
];

export default function GlobalNav() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {globalNavigation.map((nav) => {
            const Icon = nav.icon;
            const isActive = pathname === nav.href;
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
