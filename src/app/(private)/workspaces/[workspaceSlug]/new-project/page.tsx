import { NewProjectForm } from "./_components/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">New project</h1>
          <p className="text-sm text-muted-foreground">Create a project to start tracking tasks</p>
        </div>
        <NewProjectForm />
      </div>
    </div>
  );
}
