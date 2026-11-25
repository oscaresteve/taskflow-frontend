import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { NameSection } from "./_components/name-section";
import { UsernameSection } from "./_components/username-section";
import { ProfileAvatarSection } from "./_components/profile-avatar-section";

export default async function ProfilePage() {
  const t = await getTranslations("profile");

  return (
    <PageContainer className="max-w-4xl">
      <PageHeader title={t("profilePage.title")} />
      <NameSection />
      <UsernameSection />
      <ProfileAvatarSection />
    </PageContainer>
  );
}
