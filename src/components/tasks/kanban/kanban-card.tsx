import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { priorityVariant } from "@/lib/task-labels";

interface KanbanCardProps {
  taskKey: string;
  task: TaskResponseDto;
  assignee: UserResponseDto | undefined;
}

export function KanbanCard({ taskKey, task, assignee }: KanbanCardProps) {
  return (
    <Card size="sm" className="gap-2 transition-colors hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
        <span className="text-xs text-muted-foreground">{taskKey}</span>
        <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
      </div>
      <p className="px-(--card-spacing) text-sm font-medium">{task.title}</p>
      {(assignee || task.dueDate) && (
        <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
          {task.dueDate ? <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span> : <span />}
          {assignee && (
            <Avatar size="sm">
              <AvatarImage src={assignee.avatarUrl ?? undefined} alt={assignee.name} />
              <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
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
