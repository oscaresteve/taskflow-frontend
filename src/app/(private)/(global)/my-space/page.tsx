import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { getTranslations } from "next-intl/server";

export default async function MySpacePage() {
  const t = await getTranslations("mySpace");
  return (
    <PageContainer>
      <PageHeader title={t("mySpacePage.title")} />
    </PageContainer>
  );
}
