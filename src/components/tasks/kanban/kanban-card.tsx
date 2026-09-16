import type { MouseEvent } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormatter, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { useUpdateTask } from "@/hooks/use-update-task";
import { ApiError } from "@/lib/http/api-error";
import { PrioritySelect } from "@/components/tasks/priority-select";
import { TaskPriority, TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { cn } from "@/lib/utils";
import { TaskActionsMenu } from "../task-detail/task-actions-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface KanbanCardProps {
  taskKey: string;
  task: TaskResponseDto;
  workspaceSlug: string;
  projectSlug: string;
}

export function KanbanCard({ taskKey, task, workspaceSlug, projectSlug }: KanbanCardProps) {
  const format = useFormatter();
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, String(task.taskNumber));
  const taskNumber = task.taskNumber.toString();

  function stopPropagation(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  async function handleAssigneeChange(assigneeId: string | null) {
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

  async function handlePriorityChange(priority: TaskPriority) {
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

  return (
    <Card size="sm" className="gap-2 transition-colors hover:bg-muted/50 group">
      <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
        <span className="text-xs text-muted-foreground">{taskKey}</span>
        <span onClick={stopPropagation}>
          <TaskActionsMenu
            task={task}
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            taskNumber={taskNumber}
            triggerRender={
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 transition-opacity"
              >
                <MoreHorizontal />
                <span className="sr-only">{t("taskActionsMenu.ariaLabel")}</span>
              </Button>
            }
          />
        </span>
      </div>
      <p className="px-(--card-spacing) text-sm font-medium">{task.title}</p>
      <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
        <span className="flex items-center gap-2" onClick={stopPropagation}>
          <PrioritySelect variant="icon-badge" value={task.priority} onValueChange={handlePriorityChange} />
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">{format.dateTime(new Date(task.dueDate), "short")}</span>
          )}
        </span>
        <span onClick={stopPropagation}>
          <AssigneePicker
            variant="avatar"
            workspaceSlug={workspaceSlug}
            projectSlug={projectSlug}
            value={task.assigneeId}
            onChange={handleAssigneeChange}
          />
        </span>
      </div>
    </Card>
  );
}

export function SortableKanbanCard({ href, ...props }: KanbanCardProps & { href: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.task.id,
    data: { task: props.task },
    // Por defecto dnd-kit marca el nodo como role="button", que aqui taparia que la tarjeta es un
    // enlace al detalle de la tarea.
    attributes: { role: "link" },
  });

  return (
    <Link
      href={href}
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("touch-none", isDragging && "opacity-40")}
      {...listeners}
      {...attributes}
    >
      <KanbanCard {...props} />
    </Link>
  );
}
