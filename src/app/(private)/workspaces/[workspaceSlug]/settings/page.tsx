import { DeactivateWorkspaceSection } from "./_components/deactivate-workspace-section";
import { EditWorkspaceForm } from "./_components/edit-workspace-form";

export default function WorkspaceSettingsPage() {
  return (
    <div className="mx-auto p-6 w-full flex max-w-4xl flex-col gap-6 pb-20">
      <EditWorkspaceForm />
      <DeactivateWorkspaceSection />
    </div>
  );
}
