"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { getActiveProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "@/components/tasks/kanban/kanban-board";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function KanbanPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const { data: projectMembers } = useQuery(getActiveProjectMembersQuery({ workspaceSlug, projectSlug }));
  // Memoizado porque baja al tablero y de ahi al mapa de asignados: un array nuevo en cada render
  // haria que el kanban se re-renderizara entero durante el arrastre.
  const members = useMemo(() => projectMembers ?? [], [projectMembers]);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const t = useTranslations("tasks");

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("kanbanPage.failedToLoadProject")}</p>;
  }

  if (isLoading || !project) {
    return (
      <PageContainer>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={t("kanbanPage.title")}
        actions={
          <Button onClick={() => setCreateTaskOpen(true)}>
            <Plus />
            {t("kanbanPage.createTask")}
          </Button>
        }
      />

      <KanbanBoard workspaceSlug={workspaceSlug} project={project} members={members} />

      <CreateTaskDialog
        workspaceSlug={workspaceSlug}
        project={project}
        members={members}
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
    </PageContainer>
  );
}
