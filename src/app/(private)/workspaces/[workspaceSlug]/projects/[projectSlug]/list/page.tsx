"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectQuery } from "@/lib/queries/project.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskListTable } from "@/components/tasks/list/task-list-table";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useState } from "react";
import { ICONS } from "@/lib/icons";
import { useTranslations } from "next-intl";

export default function TaskListPage() {
  const { workspaceSlug, projectSlug } = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const { data: project, isLoading, isError } = useQuery(getProjectQuery({ workspaceSlug, projectSlug }));
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const t = useTranslations("tasks");

  if (isError) {
    return <p className="p-6 text-sm text-muted-foreground">{t("listPage.failedToLoadProject")}</p>;
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
        title={t("listPage.title")}
        actions={
          <Button onClick={() => setCreateTaskOpen(true)}>
            <ICONS.addNew />
            {t("listPage.createTask")}
          </Button>
        }
      />

      <TaskListTable workspaceSlug={workspaceSlug} project={project} onCreateTask={() => setCreateTaskOpen(true)} />

      <CreateTaskDialog workspaceSlug={workspaceSlug} project={project} open={createTaskOpen} onOpenChange={setCreateTaskOpen} />
    </PageContainer>
  );
}
