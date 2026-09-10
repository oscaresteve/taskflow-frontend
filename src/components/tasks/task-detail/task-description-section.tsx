"use client";

import { useTranslations } from "next-intl";
import { InlineEditableTextarea } from "@/components/common/inline-editable-textarea";
import { useUpdateTask } from "@/hooks/use-update-task";
import { taskDescriptionFieldSchema } from "@/lib/schemas/task.schema";

interface TaskDescriptionSectionProps {
  workspaceSlug: string;
  projectSlug: string;
  taskNumber: string;
  description: string | null;
}

export function TaskDescriptionSection({
  workspaceSlug,
  projectSlug,
  taskNumber,
  description,
}: TaskDescriptionSectionProps) {
  const t = useTranslations("tasks");
  const updateTask = useUpdateTask(workspaceSlug, projectSlug, taskNumber);

  return (
    <InlineEditableTextarea
      value={description ?? ""}
      onSave={(description) => updateTask.mutateAsync({ description: description || null })}
      ariaLabel={t("fields.description")}
      schema={taskDescriptionFieldSchema}
      placeholder={t("fields.descriptionPlaceholder")}
      emptyLabel={t("fields.addDescription")}
      className="text-muted-foreground"
    />
  );
}
