"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Va en este segmento y no en los de abajo porque un `error.tsx` no envuelve al layout de su propio
// segmento: las dos puertas que pueden fallar viven en `(global)/layout.tsx` y en
// `workspaces/[workspaceSlug]/layout.tsx`, asi que el boundary tiene que estar por encima.
//
// El texto no afirma la causa: en produccion Next no manda el mensaje del error al cliente, solo el
// `digest`, asi que decir "el servidor no responde" acertaria solo la mitad de las veces.
export default function PrivateError({ retry }: { retry: () => void }) {
  const t = useTranslations("common.errors");

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <Button onClick={() => retry()}>{t("retry")}</Button>
    </main>
  );
}
