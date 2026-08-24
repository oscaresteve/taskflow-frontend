"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projectTabs = [
  { label: "Overview", segment: "", Icon: LayoutDashboard },
  { label: "Members", segment: "/members", Icon: Users },
  { label: "Settings", segment: "/settings", Icon: Settings },
];

export function ProjectNavTabs() {
  const pathname = usePathname();
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const base = `/workspaces/${workspaceSlug}/projects/${projectSlug}`;

  const activeTab = [...projectTabs].reverse().find((tab) => pathname.startsWith(`${base}${tab.segment}`))?.segment;

  return (
    <Tabs value={activeTab}>
      <TabsList variant="line">
        {projectTabs.map((tab) => {
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
