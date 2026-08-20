import { NewProjectForm } from "./_components/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">New project</h1>
        <p className="text-sm text-muted-foreground">Create a project to start tracking tasks</p>
      </div>
      <NewProjectForm />
    </div>
  );
}
