import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { AssigneePicker } from "@/components/tasks/assignee-picker";
import { useUpdateTask } from "@/hooks/use-update-task";
import { ApiError } from "@/lib/http/api-error";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { cn } from "@/lib/utils";
import { priorityVariant } from "@/lib/task-labels";

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

  async function handleAssigneeChange(userId: string | null) {
    try {
      await updateTask.mutateAsync({ assigneeId: userId });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("errors.generic"),
        priority: "high",
      });
    }
  }

  return (
    <Card size="sm" className="gap-2 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
        <span className="text-xs text-muted-foreground">{taskKey}</span>
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>
      <p className="px-(--card-spacing) text-sm font-medium">{task.title}</p>
      <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
        {task.dueDate ? (
          <span className="text-xs text-muted-foreground">{format.dateTime(new Date(task.dueDate), "short")}</span>
        ) : (
          <span />
        )}
        {/* Se detiene la propagacion para que abrir el picker no dispare el drag ni la navegacion del Link. */}
        <span onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
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
