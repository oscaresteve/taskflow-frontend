import { NewWorkspaceForm } from "./_components/new-workspace-form";

export default function NewWorkspacePage() {
  return (
    <div className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">New workspace</h1>
          <p className="text-sm text-muted-foreground">Create a workspace to organize your projects</p>
        </div>
        <NewWorkspaceForm />
      </div>
    </div>
  );
}
