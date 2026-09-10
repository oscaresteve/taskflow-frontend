"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/common/form-dialog";
import { MemberCandidate, MemberPicker, toMemberCandidate } from "@/components/members/member-picker";
import { useCreateProjectMember } from "@/hooks/use-create-project-member";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useProjectRole } from "@/hooks/use-project-role";
import { getActiveWorkspaceMembersInfiniteQuery } from "@/lib/queries/workspace-member.queries";
import { ApiError } from "@/lib/http/api-error";
import { CreateProjectMemberDto, createProjectMemberSchema } from "@/lib/schemas/project-member.schema";
import { assignableProjectRoles } from "@/lib/permissions/project-member-permissions";
import { RoleIconLabel, RoleSelectItemContent } from "@/components/members/role-badge";
import { MemberRole } from "@/lib/role-labels";
import { useTranslations } from "next-intl";

const PICKER_PAGE_SIZE = 10;

interface AddProjectMemberDialogProps {
  workspaceSlug: string;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectMemberDialog({
  workspaceSlug,
  projectSlug,
  open,
  onOpenChange,
}: AddProjectMemberDialogProps) {
  const t = useTranslations("members");
  const createProjectMember = useCreateProjectMember(workspaceSlug, projectSlug);

  const { role: myRole } = useProjectRole(workspaceSlug, projectSlug);
  const assignableRoles = assignableProjectRoles(myRole);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [selected, setSelected] = useState<MemberCandidate | null>(null);

  const {
    data: workspaceMembers,
    isLoading: isCandidatesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...getActiveWorkspaceMembersInfiniteQuery({
      workspaceSlug,
      excludeProjectSlug: projectSlug,
      search: debouncedSearch,
      limit: PICKER_PAGE_SIZE,
    }),
    enabled: open,
  });

  const candidates: MemberCandidate[] = (workspaceMembers?.pages.flatMap((page) => page.data) ?? []).map(
    toMemberCandidate,
  );
  const remaining = workspaceMembers
    ? workspaceMembers.pages[workspaceMembers.pages.length - 1].pagination.total - candidates.length
    : 0;

  const form = useForm<CreateProjectMemberDto>({
    resolver: zodResolver(createProjectMemberSchema),
    defaultValues: {
      userId: "",
      role: "MEMBER",
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setSearch("");
      setSelected(null);
    }
    onOpenChange(next);
  }

  function handleSelect(candidate: MemberCandidate) {
    setSelected(candidate);
    form.setValue("userId", candidate.userId, { shouldValidate: true });
  }

  function handleClear() {
    setSelected(null);
    form.setValue("userId", "", { shouldValidate: true });
  }

  async function onSubmit(data: CreateProjectMemberDto) {
    try {
      const addedName = selected?.name;
      await createProjectMember.mutateAsync(data);
      handleOpenChange(false);
      toast.add({
        type: "success",
        description: t("addProjectMemberDialog.addedToast", { name: addedName ?? "" }),
      });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : t("genericError"),
        priority: "high",
      });
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={t("addProjectMemberDialog.title")}
      description={t("addProjectMemberDialog.description")}
      formId="add-project-member-form"
      submitLabel={t("addProjectMemberDialog.submitLabel")}
      pending={createProjectMember.isPending}
    >
      <form id="add-project-member-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <MemberPicker
            id="project-member"
            search={search}
            onSearchChange={setSearch}
            candidates={candidates}
            isLoading={isCandidatesLoading}
            emptyMessage={t("addProjectMemberDialog.emptyMessage")}
            selected={selected}
            onSelect={handleSelect}
            onClear={handleClear}
            error={!!form.formState.errors.userId}
            hasMore={hasNextPage}
            isLoadingMore={isFetchingNextPage}
            remaining={remaining}
            onLoadMore={() => fetchNextPage()}
          />
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="project-member-role">{t("addProjectMemberDialog.roleLabel")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="project-member-role" className="w-full">
                    <SelectValue>{(role: MemberRole) => <RoleIconLabel role={role} />}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        <RoleSelectItemContent role={role} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </FormDialog>
  );
}
