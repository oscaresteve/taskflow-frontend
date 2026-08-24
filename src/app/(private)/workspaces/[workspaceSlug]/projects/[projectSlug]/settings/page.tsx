import { ArchiveProjectSection } from "./_components/archive-project-section";
import { EditProjectForm } from "./_components/edit-project-form";
import { PageContainer } from "@/components/page-container";

export default function ProjectSettingsPage() {
  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <EditProjectForm />
      <ArchiveProjectSection />
    </PageContainer>
  );
}
