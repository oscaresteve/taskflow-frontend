import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ColorSchemeSection } from "./_components/color-scheme-section";

export default async function PreferencesPage() {
  const t = await getTranslations("preferences");

  return (
    <PageContainer className="flex flex-col gap-6 pb-20">
      <PageHeader title={t("preferencesPage.title")} />
      <ColorSchemeSection />
    </PageContainer>
  );
}
