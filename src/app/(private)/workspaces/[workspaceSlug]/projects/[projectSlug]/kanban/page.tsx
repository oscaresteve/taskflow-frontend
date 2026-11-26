"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanBoard } from "@/components/tasks/kanban/kanban-board";
import { PageContainer } from "@/components/common/page-container";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function KanbanPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
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
    // El tablero ocupa el alto que sobra y hace scroll por columna, asi que es la pagina la que no
    // crece: min-h-0 deja que el contenedor flex se encoja hasta el alto real disponible.
    <PageContainer className="min-h-0 flex-1">
      <KanbanBoard workspaceSlug={workspaceSlug} project={project} onCreateTask={() => setCreateTaskOpen(true)} />

      <CreateTaskDialog workspaceSlug={workspaceSlug} project={project} open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </PageContainer>
  );
}
