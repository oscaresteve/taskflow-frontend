import { getRequestConfig } from "next-intl/server";

import common from "@/messages/en/common.json";
import layout from "@/messages/en/layout.json";
import auth from "@/messages/en/auth.json";
import onboarding from "@/messages/en/onboarding.json";
import home from "@/messages/en/home.json";
import preferences from "@/messages/en/preferences.json";
import workspaces from "@/messages/en/workspaces.json";
import projects from "@/messages/en/projects.json";
import members from "@/messages/en/members.json";
import tasks from "@/messages/en/tasks.json";

export default getRequestConfig(async () => {
  return {
    locale: "en",
    messages: {
      common,
      layout,
      auth,
      onboarding,
      home,
      preferences,
      workspaces,
      projects,
      members,
      tasks,
    },
  };
});
