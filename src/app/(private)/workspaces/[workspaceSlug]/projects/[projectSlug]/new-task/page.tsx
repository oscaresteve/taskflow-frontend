import { NewTaskForm } from "./_components/new-task-form";

export default function NewTaskPage() {
  return (
    <div className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">New task</h1>
          <p className="text-sm text-muted-foreground">Add a task to this project</p>
        </div>
        <NewTaskForm />
      </div>
    </div>
  );
}
