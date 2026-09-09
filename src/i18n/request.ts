import { getRequestConfig } from "next-intl/server";
import { getCurrentUser } from "@/lib/api/auth.server";
import { normalizeLocale, type Locale } from "@/lib/locale";

import commonEn from "@/messages/en/common.json";
import layoutEn from "@/messages/en/layout.json";
import authEn from "@/messages/en/auth.json";
import onboardingEn from "@/messages/en/onboarding.json";
import mySpaceEn from "@/messages/en/my-space.json";
import preferencesEn from "@/messages/en/preferences.json";
import workspacesEn from "@/messages/en/workspaces.json";
import projectsEn from "@/messages/en/projects.json";
import membersEn from "@/messages/en/members.json";
import tasksEn from "@/messages/en/tasks.json";

import commonEs from "@/messages/es/common.json";
import layoutEs from "@/messages/es/layout.json";
import authEs from "@/messages/es/auth.json";
import onboardingEs from "@/messages/es/onboarding.json";
import mySpaceEs from "@/messages/es/my-space.json";
import preferencesEs from "@/messages/es/preferences.json";
import workspacesEs from "@/messages/es/workspaces.json";
import projectsEs from "@/messages/es/projects.json";
import membersEs from "@/messages/es/members.json";
import tasksEs from "@/messages/es/tasks.json";

const messagesByLocale = {
  en: {
    common: commonEn,
    layout: layoutEn,
    auth: authEn,
    onboarding: onboardingEn,
    mySpace: mySpaceEn,
    preferences: preferencesEn,
    workspaces: workspacesEn,
    projects: projectsEn,
    members: membersEn,
    tasks: tasksEn,
  },
  es: {
    common: commonEs,
    layout: layoutEs,
    auth: authEs,
    onboarding: onboardingEs,
    mySpace: mySpaceEs,
    preferences: preferencesEs,
    workspaces: workspacesEs,
    projects: projectsEs,
    members: membersEs,
    tasks: tasksEs,
  },
} satisfies Record<Locale, unknown>;

export default getRequestConfig(async () => {
  // El locale persiste en el modelo de usuario (no en cookie), asi que hay que resolver
  // al usuario autenticado en cada request; sin sesion (paginas publicas) cae al default.
  const user = await getCurrentUser();
  const locale: Locale = normalizeLocale(user?.locale);

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
