"use client";

import { useTranslations } from "next-intl";
import { InlineEditableInput } from "@/components/common/inline-editable-input";
import { toast } from "@/components/ui/toast";
import { useUpdateTask } from "@/hooks/use-update-task";
import { taskTitleSchema } from "@/lib/schemas/task.schema";

interface TaskNameSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  title: string;
}

export function TaskNameSection({ workspaceSlug, projectSlug, taskNumber, title }: TaskNameSectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);

  return (
    <InlineEditableInput
      value={title}
      onSave={async (title) => {
        await updateTask.mutateAsync({ title });
        toast.add({ type: "success", description: t("updateSuccess") });
      }}
      ariaLabel={t("fields.title")}
      schema={taskTitleSchema}
      className="text-xl! font-semibold"
    />
  );
}
