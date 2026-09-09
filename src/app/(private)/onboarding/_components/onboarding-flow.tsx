"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { WorkspaceResponseDto } from "@/lib/dtos/workspaces.dto";
import { OnboardingWorkspaceForm } from "./onboarding-workspace-form";
import { OnboardingProjectForm } from "./onboarding-project-form";

interface OnboardingFlowProps {
  name: string;
}

export function OnboardingFlow({ name }: OnboardingFlowProps) {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceResponseDto | null>(null);
  const step = workspace ? 2 : 1;

  function goToWorkspace() {
    router.push(`/workspaces/${workspace!.slug}`);
  }

  return (
    <div className="flex w-md flex-col">
      {workspace ? (
        <>
          <h1 className="text-3xl font-semibold text-balance">{t("onboardingFlow.projectStepTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("onboardingFlow.projectStepDescription", { workspaceName: workspace.name })}
          </p>
          <OnboardingProjectForm
            workspaceSlug={workspace.slug}
            workspaceName={workspace.name}
            onCreated={(project) => router.push(`/workspaces/${workspace.slug}/projects/${project.slug}`)}
            onSkip={goToWorkspace}
          />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold text-balance">{t("onboardingFlow.workspaceStepTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("onboardingFlow.workspaceStepDescription")}</p>
          <OnboardingWorkspaceForm name={name} onCreated={setWorkspace} />
        </>
      )}
      <div className="mt-8 flex justify-center gap-1.5">
        {[1, 2].map((s) => (
          <span key={s} className={cn("h-1 w-8 rounded-full", s <= step ? "bg-foreground" : "bg-muted")} />
        ))}
      </div>
    </div>
  );
}
