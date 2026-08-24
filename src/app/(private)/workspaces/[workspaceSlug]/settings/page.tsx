import { DeactivateWorkspaceSection } from "./_components/deactivate-workspace-section";
import { EditWorkspaceForm } from "./_components/edit-workspace-form";
import { PageContainer } from "@/components/page-container";

export default function WorkspaceSettingsPage() {
  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <EditWorkspaceForm />
      <DeactivateWorkspaceSection />
    </PageContainer>
  );
}
