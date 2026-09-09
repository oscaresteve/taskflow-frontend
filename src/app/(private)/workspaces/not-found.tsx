import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function WorkspaceNotFound() {
  const t = await getTranslations("workspaces");

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-semibold">{t("notFound.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("notFound.description")}</p>
      </div>
      <Button nativeButton={false} render={<Link href="/home" />}>
        {t("notFound.goToHome")}
      </Button>
    </main>
  );
}
