import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ColorSchemeSection } from "./_components/color-scheme-section";

export default function PreferencesPage() {
  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <PageHeader title="Preferences" />
      <ColorSchemeSection />
    </PageContainer>
  );
}
