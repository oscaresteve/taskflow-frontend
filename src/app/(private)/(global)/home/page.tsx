import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  return <div>{t("homePage.title")}</div>;
}
