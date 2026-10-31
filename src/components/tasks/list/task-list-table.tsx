"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ProjectResponseDto } from "@/lib/dtos/projects.dto";
import { TaskPriority, TaskResponseDto, TaskStatus } from "@/lib/dtos/tasks.dto";
import { getTasksQuery } from "@/lib/queries/task.queries";
import { useTasksTable } from "@/hooks/use-tasks-table";
import { useUpdateTask } from "@/hooks/use-update-task";
import { buildTaskModalHref } from "@/hooks/use-task-modal-href";
import { ApiError } from "@/lib/http/api-error";
import { ALL_ASSIGNEES, TaskLifecycle, taskLifecycles, TaskSortField, taskSortFields } from "@/lib/task-enums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTabParam } from "@/hooks/use-tab-param";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { cn } from "@/lib/utils";
import { ICONS, type Icon } from "@/lib/icons";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortControls } from "@/components/common/sort-controls";
import { PageSizeSelect } from "@/components/common/page-size-select";
import { PaginationControls } from "@/components/common/pagination-controls";
import { EmptyState } from "@/components/common/empty-state";
import { KanbanFilterBar } from "@/components/tasks/kanban/kanban-filter-bar";
import { StatusSelect } from "@/components/tasks/status-select";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { DueDatePicker } from "@/components/tasks/due-date-picker";
import { TaskActionsMenu } from "@/components/tasks/task-detail/task-actions-menu";

interface TaskListTableProps {
  workspaceSlug: string;
  project: ProjectResponseDto;
  onCreateTask?: () => void;
}

function TaskListRow({
  href,
  taskKey,
  task,
  workspaceSlug,
  projectSlug,
}: {
  href: string;
  taskKey: string;
  task: TaskResponseDto;
  workspaceSlug: string;
  projectSlug: string;
}) {
  const t = useTranslations("tasks");
  const taskNumber = task.taskNumber.toString();
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);

  async function handleStatusChange(status: TaskStatus) {
    if (task.status === status) return;
    try {
      await updateTask.mutateAsync({ status });
      toast.add({ type: "success", description: t("statusUpdated", { status: t(`status.${status}`) }) });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  async function handlePriorityChange(priority: TaskPriority) {
    if (task.priority === priority) return;
    try {
      await updateTask.mutateAsync({ priority });
      toast.add({ type: "success", description: t("priorityUpdated", { priority: t(`priority.${priority}`) }) });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  async function handleAssigneeChange(assigneeId: string | null) {
    if (task.assigneeId === assigneeId) return;
    try {
      await updateTask.mutateAsync({ assigneeId });
      toast.add({ type: "success", description: t("assigneeUpdated") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  async function handleDueDateChange(dueDate: string | null) {
    if (task.dueDate === dueDate) return;
    try {
      await updateTask.mutateAsync({ dueDate });
      toast.add({ type: "success", description: t("dueDateUpdated") });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <TableRow>
      <TableCell>
        <Link href={href} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{taskKey}</span>
          <span className="truncate font-medium">{task.title}</span>
        </Link>
      </TableCell>
      <TableCell>
        <StatusSelect variant="badge" value={task.status} onValueChange={handleStatusChange} />
      </TableCell>
      <TableCell>
        <PrioritySelect variant="badge" value={task.priority} onValueChange={handlePriorityChange} />
      </TableCell>
      <TableCell>
        <AssigneePicker
          variant="avatar"
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          value={task.assigneeId}
          onChange={handleAssigneeChange}
        />
      </TableCell>
      <TableCell>
        <DueDatePicker variant="icon-label" value={task.dueDate} onChange={handleDueDateChange} />
      </TableCell>
      <TableCell>
        <TaskActionsMenu
          task={task}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
          taskNumber={taskNumber}
          variant="ghost"
        />
      </TableCell>
    </TableRow>
  );
}

export function TaskListTable({ workspaceSlug, project, onCreateTask }: TaskListTableProps) {
  const t = useTranslations("tasks");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    search,
    status,
    assigneeId,
    priority,
    dueDate,
    isFavorite,
    sort,
    order,
    limit,
    page,
    debouncedSearch,
    pageSizeOptions,
    onSearchChange,
    onStatusChange,
    onAssigneeChange,
    onPriorityChange,
    onDueDateChange,
    onFavoriteChange,
    onSortFieldChange,
    onSortOrderChange,
    onLimitChange,
    onPageChange,
  } = useTasksTable();

  // Archivar y desarchivar una tarea es cosa del mando del proyecto —y solo de el, el del espacio no
  // alcanza aqui—, asi que a los demas la pestana de archivadas no les ofrece nada.
  const availableTabs: readonly TaskLifecycle[] = isProjectManager(project.myRole) ? taskLifecycles : ["ACTIVE"];

  const { tab, onTabChange } = useTabParam(taskLifecycles, "ACTIVE", availableTabs);

  const LIFECYCLE_TABS: Record<TaskLifecycle, { label: string; icon: Icon }> = {
    ACTIVE: { label: t("listTable.lifecycle.tasks"), icon: ICONS.list },
    ARCHIVED: { label: t("listTable.lifecycle.archived"), icon: ICONS.archive },
  };

  const sortOptions: { value: TaskSortField; label: string }[] = taskSortFields.map((field) => ({
    value: field,
    label: t(`listTable.sortOptions.${field}`),
  }));

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    ...getTasksQuery({
      workspaceSlug,
      projectSlug: project.slug,
      page,
      limit,
      search: debouncedSearch,
      status,
      assigneeId,
      priority,
      dueDate,
      isArchived: tab === "ARCHIVED",
      isFavorite,
      sort,
      order,
    }),
    placeholderData: keepPreviousData,
  });

  // Un contador por pestana, con los mismos filtros que la tabla para que el numero cuadre con lo
  // que se ve debajo.
  const countParams = {
    workspaceSlug,
    projectSlug: project.slug,
    page: 1,
    limit: 1,
    search: debouncedSearch,
    status,
    assigneeId,
    priority,
    dueDate,
    isFavorite,
  };
  const activeCountQuery = useQuery(getTasksQuery({ ...countParams, isArchived: false }));
  const archivedCountQuery = useQuery({
    ...getTasksQuery({ ...countParams, isArchived: true }),
    enabled: isProjectManager(project.myRole),
  });
  const countQueryByTab = {
    ACTIVE: activeCountQuery,
    ARCHIVED: archivedCountQuery,
  };

  if (isError) {
    return <p className="py-4 text-sm text-muted-foreground">{t("listTable.failedToLoad")}</p>;
  }

  const hasActiveFilters =
    !!search ||
    status !== "ALL" ||
    assigneeId !== ALL_ASSIGNEES ||
    priority !== "ALL" ||
    dueDate !== "ALL" ||
    tab === "ARCHIVED" ||
    isFavorite;

  const emptyState = hasActiveFilters ? (
    <EmptyState
      icon={ICONS.list}
      title={t("listTable.noTasksFiltered")}
      description={t("listTable.noTasksFilteredDescription")}
    />
  ) : (
    <EmptyState
      icon={ICONS.list}
      title={t("listTable.noTasks")}
      description={t("listTable.noTasksDescription")}
      action={
        onCreateTask ? (
          <Button size="sm" onClick={onCreateTask}>
            <ICONS.addNew />
            {t("listPage.createTask")}
          </Button>
        ) : undefined
      }
    />
  );

  // Lo mismo en las dos pestanas: lo que cambia es la query, no la tabla.
  const tabContent = (
    <>
      {isLoading || !tasks ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : tasks.data.length === 0 ? (
        emptyState
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("listTable.columns.task")}</TableHead>
              <TableHead>{t("listTable.columns.status")}</TableHead>
              <TableHead>{t("listTable.columns.priority")}</TableHead>
              <TableHead>{t("listTable.columns.assignee")}</TableHead>
              <TableHead>{t("listTable.columns.dueDate")}</TableHead>
              <TableHead>{t("listTable.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.data.map((task) => (
              <TaskListRow
                key={task.id}
                href={buildTaskModalHref({
                  pathname,
                  searchParams,
                  workspaceSlug,
                  projectSlug: project.slug,
                  taskNumber: task.taskNumber,
                })}
                taskKey={`${project.key}-${task.taskNumber}`}
                task={task}
                workspaceSlug={workspaceSlug}
                projectSlug={project.slug}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {tasks && tasks.data.length > 0 && (
        <PaginationControls page={page} totalPages={tasks.pagination.pages} onPageChange={onPageChange} />
      )}
    </>
  );

  return (
    <Tabs className="gap-4" value={tab} onValueChange={(value) => onTabChange(value as TaskLifecycle)}>
      <div className="border-b">
        <TabsList variant="line">
          {availableTabs.map((lifecycle) => {
            const { label, icon: TabIcon } = LIFECYCLE_TABS[lifecycle];
            const total = countQueryByTab[lifecycle].data?.pagination.total;
            return (
              <TabsTrigger key={lifecycle} value={lifecycle}>
                <TabIcon />
                {label}
                {typeof total === "number" && <Badge variant="secondary">{total}</Badge>}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <KanbanFilterBar
            workspaceSlug={workspaceSlug}
            projectSlug={project.slug}
            search={search}
            onSearchChange={onSearchChange}
            status={status}
            onStatusChange={onStatusChange}
            assigneeId={assigneeId}
            onAssigneeChange={onAssigneeChange}
            priority={priority}
            onPriorityChange={onPriorityChange}
            dueDate={dueDate}
            onDueDateChange={onDueDateChange}
          />
          <Button
            type="button"
            variant={isFavorite ? "secondary" : "outline"}
            onClick={() => onFavoriteChange(!isFavorite)}
            aria-pressed={isFavorite}
          >
            <ICONS.favorite className={cn(isFavorite && "fill-current")} />
            {t("listTable.favoritesFilter")}
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <SortControls
            field={sort}
            order={order}
            options={sortOptions}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
          <PageSizeSelect value={limit} options={pageSizeOptions} onChange={onLimitChange} />
        </div>
      </div>

      {availableTabs.map((lifecycle) => (
        <TabsContent key={lifecycle} value={lifecycle} className="flex flex-col gap-4">
          {tabContent}
        </TabsContent>
      ))}
    </Tabs>
  );
}
