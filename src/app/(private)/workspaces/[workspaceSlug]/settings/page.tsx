import { DeactivateWorkspaceSection } from "./_components/deactivate-workspace-section";
import { EditWorkspaceForm } from "./_components/edit-workspace-form";

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">Workspace settings</h1>
        <p className="text-sm text-muted-foreground">Update your workspace&apos;s name and description</p>
      </div>
      <div className="max-w-sm">
        <EditWorkspaceForm />
      </div>
      <div className="grid gap-1">
        <h2 className="text-sm font-semibold">Danger zone</h2>
        <DeactivateWorkspaceSection />
      </div>
    </div>
  );
}
