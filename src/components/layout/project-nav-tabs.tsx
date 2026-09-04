"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Kanban, LayoutDashboard, Settings, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectRole } from "@/hooks/use-project-role";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";

const projectTabs = [
  { label: "Overview", segment: "", Icon: LayoutDashboard },
  { label: "Kanban", segment: "/kanban", Icon: Kanban },
  { label: "Members", segment: "/members", Icon: Users },
  { label: "Settings", segment: "/settings", Icon: Settings },
];

export function ProjectNavTabs() {
  const pathname = usePathname();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);
  const base = `/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const tabs = isProjectManager(myRole) ? projectTabs : projectTabs.filter((tab) => tab.segment !== "/settings");
  const activeTab = [...tabs].reverse().find((tab) => pathname.startsWith(`${base}${tab.segment}`))?.segment;

  return (
    <Tabs value={activeTab}>
      <TabsList variant="line">
        {tabs.map((tab) => {
          const href = `${base}${tab.segment}`;
          return (
            <TabsTrigger key={tab.segment} value={tab.segment} nativeButton={false} render={<Link href={href} />}>
              <tab.Icon />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
