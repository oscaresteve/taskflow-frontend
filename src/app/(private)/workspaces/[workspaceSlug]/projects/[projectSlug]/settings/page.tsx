import { ArchiveProjectSection } from "./_components/archive-project-section";
import { EditProjectForm } from "./_components/edit-project-form";

export default function ProjectSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold">Project settings</h1>
        <p className="text-sm text-muted-foreground">Update your project&apos;s name and description</p>
      </div>
      <div className="max-w-sm">
        <EditProjectForm />
      </div>
      <div className="grid gap-1">
        <h2 className="text-sm font-semibold">Danger zone</h2>
        <ArchiveProjectSection />
      </div>
    </div>
  );
}
