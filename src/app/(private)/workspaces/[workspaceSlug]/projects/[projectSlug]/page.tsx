"use client";

import { getProjectQuery } from "@/lib/queries/projects.queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  console.log(project);
  return <div>ProjectPage</div>;
}
