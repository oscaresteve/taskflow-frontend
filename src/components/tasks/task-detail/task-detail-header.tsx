import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

interface TaskDetailHeaderProps {
  breadcrumb: ReactNode;
  isArchived: boolean;
  archivedLabel: string;
  closeLabel: string;
  actions?: ReactNode;
}

export function TaskDetailHeader({ breadcrumb, isArchived, archivedLabel, closeLabel, actions }: TaskDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {breadcrumb}
        {isArchived && <Badge variant="outline">{archivedLabel}</Badge>}
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <DialogClose render={<Button variant="outline" size="icon-sm" />}>
          <XIcon />
          <span className="sr-only">{closeLabel}</span>
        </DialogClose>
      </div>
    </div>
  );
}
