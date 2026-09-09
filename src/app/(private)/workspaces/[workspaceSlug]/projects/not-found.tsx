"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  const pathname = usePathname();
  const workspaceSlug = pathname.split("/")[2];
  const t = useTranslations("projects");

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-semibold">{t("projectNotFound.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("projectNotFound.description")}</p>
      </div>
      <Button nativeButton={false} render={<Link href={`/workspaces/${workspaceSlug}`} />}>
        {t("projectNotFound.goToWorkspace")}
      </Button>
    </main>
  );
}
