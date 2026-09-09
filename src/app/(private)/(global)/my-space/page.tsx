import { getTranslations } from "next-intl/server";

export default async function MySpacePage() {
  const t = await getTranslations("mySpace");
  return <div>{t("mySpacePage.title")}</div>;
}
