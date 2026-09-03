"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/common/form-dialog";
import { MemberCandidate, MemberPicker } from "@/components/members/member-picker";
import { useCreateWorkspaceMember } from "@/hooks/use-create-workspace-member";
import { useWorkspaceRole } from "@/hooks/use-workspace-role";
import { getUsersInfiniteQuery } from "@/lib/queries/user.queries";
import { ApiError } from "@/lib/http/api-error";
import { CreateWorkspaceMemberDto, createWorkspaceMemberSchema } from "@/lib/schemas/workspace-member.schema";
import { assignableWorkspaceRoles } from "@/lib/permissions/workspace-member-permissions";

const PICKER_PAGE_SIZE = 10;

interface AddWorkspaceMemberDialogProps {
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWorkspaceMemberDialog({ workspaceSlug, open, onOpenChange }: AddWorkspaceMemberDialogProps) {
  const createWorkspaceMember = useCreateWorkspaceMember(workspaceSlug);
  const { role: myRole } = useWorkspaceRole(workspaceSlug);
  const assignableRoles = assignableWorkspaceRoles(myRole);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<MemberCandidate | null>(null);

  const form = useForm<CreateWorkspaceMemberDto>({
    resolver: zodResolver(createWorkspaceMemberSchema),
    defaultValues: {
      userId: "",
      role: "MEMBER",
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setSearch("");
      setDebouncedSearch("");
      setSelected(null);
    }
    onOpenChange(next);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: users,
    isLoading: isUsersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(getUsersInfiniteQuery(debouncedSearch, workspaceSlug, PICKER_PAGE_SIZE));
  const candidates: MemberCandidate[] = (users?.pages.flatMap((page) => page.data) ?? []).map((user) => ({
    id: user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }));
  const remaining = users ? users.pages[users.pages.length - 1].pagination.total - candidates.length : 0;

  function handleSelect(candidate: MemberCandidate) {
    setSelected(candidate);
    form.setValue("userId", candidate.userId, { shouldValidate: true });
  }

  function handleClear() {
    setSelected(null);
    form.setValue("userId", "", { shouldValidate: true });
  }

  async function onSubmit(data: CreateWorkspaceMemberDto) {
    try {
      const addedName = selected?.name;
      await createWorkspaceMember.mutateAsync(data);
      handleOpenChange(false);
      toast.add({
        type: "success",
        description: `${addedName} added, pending activation.`,
      });
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof ApiError ? error.message : "Something went wrong",
        priority: "high",
      });
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Add member"
      description="Search for a person by name or email. They'll be added as pending until an owner or admin activates them."
      formId="add-member-form"
      submitLabel="Add member"
      pending={createWorkspaceMember.isPending}
    >
      <form id="add-member-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <MemberPicker
            id="member"
            search={search}
            onSearchChange={setSearch}
            candidates={candidates}
            isLoading={isUsersLoading}
            emptyMessage="No matching people found."
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
                <FieldLabel htmlFor="member-role">Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="member-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
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
