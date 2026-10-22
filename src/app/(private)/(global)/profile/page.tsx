import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/common/page-container";
import { PageHeader } from "@/components/common/page-header";
import { ProfileAvatarSection } from "./_components/profile-avatar-section";
import { FirstNameSection } from "./_components/first-name-section";
import { LastNameSection } from "./_components/last-name-section";
import { UsernameSection } from "./_components/username-section";

export default async function ProfilePage() {
  const t = await getTranslations("profile");

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader title={t("profilePage.title")} />
      <ProfileAvatarSection />
      <FirstNameSection />
      <LastNameSection />
      <UsernameSection />
    </PageContainer>
  );
}
