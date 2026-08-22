import { ArchiveProjectSection } from "./_components/archive-project-section";
import { EditProjectForm } from "./_components/edit-project-form";

export default function ProjectSettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pb-20">
      <EditProjectForm />
      <ArchiveProjectSection />
    </div>
  );
}
