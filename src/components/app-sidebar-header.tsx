import { workspacesQuery } from "@/lib/queries/workspaces.queries";
import { useQuery } from "@tanstack/react-query";

export default function AppSidebarHeader({ isMobile }: { isMobile: boolean }) {
  const { data: workspaces, isLoading } = useQuery(workspacesQuery);

  return <div>Sidebar Header</div>;
}
