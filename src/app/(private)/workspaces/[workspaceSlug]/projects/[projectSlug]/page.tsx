"use client";

import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";

export default function ProjectPage() {
  const t = useTranslations("projects");

  return (
    <PageContainer>
      <PageHeader title={t("projectOverviewPage.title")} />
    </PageContainer>
  );
}
