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
import { useTabParam } from "@/hooks/use-tab-param";
import { isProjectManager } from "@/lib/permissions/project-member-permissions";
import { ICONS } from "@/lib/icons";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortControl } from "@/components/common/sort-control";
import { ListFooter } from "@/components/common/list-footer";
import { EmptyState } from "@/components/common/empty-state";
import { FavoritesFilter } from "@/components/common/favorites-filter";
import { LifecycleFilter } from "@/components/common/lifecycle-filter";
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
    sortIsDefault,
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

  // El contador de archivadas lleva los mismos filtros que la tabla, para que el numero cuadre con
  // lo que se ve al pulsar el chip. Los vivos no lo necesitan: son lo que ya estas mirando.
  const archivedCountQuery = useQuery({
    ...getTasksQuery({
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
      isArchived: true,
    }),
    enabled: isProjectManager(project.myRole),
  });

  const lifecycleOptions = availableTabs.includes("ARCHIVED")
    ? [
        {
          value: "ARCHIVED" as const,
          label: t("listTable.lifecycle.archived"),
          icon: ICONS.archive,
          count: archivedCountQuery.data?.pagination.total,
        },
      ]
    : [];

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
          <Button onClick={onCreateTask}>
            <ICONS.addNew />
            {t("listPage.createTask")}
          </Button>
        ) : undefined
      }
    />
  );

  // El subconjunto solo cambia la query, no la tabla: se pinta una vez.
  const tableContent = (
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
        <ListFooter
          limit={limit}
          pageSizeOptions={pageSizeOptions}
          onLimitChange={onLimitChange}
          page={page}
          totalPages={tasks.pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Rejilla y no flex: con justify-between la accion se iba a una segunda linea en cuanto
          los filtros llenaban la primera, y ahi ademas caia a la izquierda. Con una columna
          propia se queda en su esquina y los filtros envuelven debajo de si mismos. */}
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
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
          <LifecycleFilter
            value={tab}
            activeValue="ACTIVE"
            onValueChange={onTabChange}
            options={lifecycleOptions}
          />
          <FavoritesFilter value={isFavorite} onValueChange={onFavoriteChange} />
          <SortControl
            field={sort}
            order={order}
            options={sortOptions}
            isDefault={sortIsDefault}
            onFieldChange={onSortFieldChange}
            onOrderChange={onSortOrderChange}
          />
        </div>
        {onCreateTask && (
          <Button onClick={onCreateTask}>
            <ICONS.addNew />
            {t("listPage.createTask")}
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">{tableContent}</div>
    </div>
  );
}
