"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2Icon } from "lucide-react";
import { SettingCard } from "@/components/common/setting-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { useUpdateMe } from "@/hooks/use-update-me";
import { ApiError } from "@/lib/http/api-error";
import { locales, normalizeLocale, type Locale } from "@/lib/locale";

const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

const LOCALE_OPTIONS: { value: Locale; flag: string }[] = locales.map((value) => ({
  value,
  flag: LOCALE_FLAGS[value],
}));

export function LanguageSection() {
  const t = useTranslations("preferences");
  const { data: user, isLoading } = useQuery(getMeQuery());

  if (isLoading || !user) {
    return (
      <SettingCard
        title={t("languageSection.title")}
        description={t("languageSection.description")}
        action={<Skeleton className="h-8 w-40" />}
      />
    );
  }

  return <LanguagePicker key={normalizeLocale(user.locale)} savedLocale={normalizeLocale(user.locale)} />;
}

function LanguagePicker({ savedLocale }: { savedLocale: Locale }) {
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const updateMe = useUpdateMe();
  const [locale, setLocale] = useState<Locale>(savedLocale);

  const localeLabels: Record<Locale, string> = {
    en: t("languageSection.en"),
    es: t("languageSection.es"),
  };

  function handleSave() {
    if (locale === savedLocale) return;
    updateMe.mutate(
      { locale },
      {
        onSuccess: () => router.refresh(),
        onError: (error) => {
          toast.add({
            type: "error",
            description: error instanceof ApiError ? error.message : t("errors.generic"),
            priority: "high",
          });
        },
      },
    );
  }

  return (
    <SettingCard
      title={t("languageSection.title")}
      description={t("languageSection.description")}
      footerAction={
        <Button onClick={handleSave} disabled={updateMe.isPending || locale === savedLocale}>
          {updateMe.isPending && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {tCommon("actions.save")}
        </Button>
      }
      orientation="horizontal"
    >
      <Select
        value={locale}
        onValueChange={(value) => value && setLocale(value as Locale)}
        disabled={updateMe.isPending}
      >
        <SelectTrigger className="w-40">
          <SelectValue>
            {() => (
              <>
                <span aria-hidden="true">{LOCALE_OPTIONS.find((option) => option.value === locale)?.flag}</span>
                {localeLabels[locale]}
              </>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LOCALE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span aria-hidden="true">{option.flag}</span>
              {localeLabels[option.value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingCard>
  );
}
