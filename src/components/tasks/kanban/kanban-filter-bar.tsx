"use client";

import { useTranslations } from "next-intl";
import { SearchInput } from "@/components/common/search-input";
import { AssigneeFilterSelect } from "@/components/tasks/assignee-filter-select";
import { DueDateFilterSelect } from "@/components/tasks/due-date-filter-select";
import { PriorityFilterSelect } from "@/components/tasks/priority-select";
import { DueDateFilter, PriorityFilter } from "@/lib/task-enums";

export function KanbanFilterBar({
  workspaceSlug,
  projectSlug,
  search,
  onSearchChange,
  assigneeId,
  onAssigneeChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
}: {
  workspaceSlug: string;
  projectSlug: string;
  search: string;
  onSearchChange: (value: string) => void;
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  priority: PriorityFilter;
  onPriorityChange: (value: PriorityFilter) => void;
  dueDate: DueDateFilter;
  onDueDateChange: (value: DueDateFilter) => void;
}) {
  const t = useTranslations("tasks");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("kanbanFilterBar.searchPlaceholder")}
        className="w-48"
      />
      <AssigneeFilterSelect
        workspaceSlug={workspaceSlug}
        projectSlug={projectSlug}
        value={assigneeId}
        onChange={onAssigneeChange}
      />
      <PriorityFilterSelect value={priority} onValueChange={onPriorityChange} />
      <DueDateFilterSelect value={dueDate} onValueChange={onDueDateChange} />
    </div>
  );
}
