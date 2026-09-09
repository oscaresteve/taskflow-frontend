import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ColorSchemeSection } from "./_components/color-scheme-section";
import { LanguageSection } from "./_components/language-section";

export default async function PreferencesPage() {
  const t = await getTranslations("preferences");

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("preferencesPage.title")} />
      <ColorSchemeSection />
      <LanguageSection />
    </PageContainer>
  );
}
