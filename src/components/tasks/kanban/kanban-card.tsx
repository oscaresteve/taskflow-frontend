import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { TaskResponseDto } from "@/lib/dtos/tasks.dto";
import { priorityVariant } from "@/lib/task-labels";
import { formatDate, getInitials } from "@/lib/utils";

interface KanbanCardProps {
  href: string;
  taskKey: string;
  task: TaskResponseDto;
  assignee: UserResponseDto | undefined;
}

export function KanbanCard({ href, taskKey, task, assignee }: KanbanCardProps) {
  return (
    <Link href={href}>
      <Card size="sm" className="gap-2 transition-colors hover:bg-muted/50">
        <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
          <span className="text-xs text-muted-foreground">{taskKey}</span>
          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        </div>
        <p className="px-(--card-spacing) text-sm font-medium">{task.title}</p>
        {(assignee || task.dueDate) && (
          <div className="flex items-center justify-between gap-2 px-(--card-spacing)">
            {task.dueDate ? (
              <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
            ) : (
              <span />
            )}
            {assignee && (
              <Avatar size="sm">
                <AvatarImage src={assignee.avatarUrl ?? undefined} alt={assignee.name} />
                <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}
