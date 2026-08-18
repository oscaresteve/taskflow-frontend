"use client";

import { getWorkspaceQuery } from "@/lib/queries/workspaces.queries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function WorkspacePage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const { data: workspace } = useQuery(getWorkspaceQuery(workspaceSlug));
  console.log(workspace);

  return <div>Workspace</div>;
}
