"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, UserIcon, XIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { FormDialog } from "@/components/form-dialog";
import { useCreateProjectMember } from "@/hooks/use-create-project-member";
import { getActiveWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getProjectMembersQuery } from "@/lib/queries/project-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { ApiError } from "@/lib/http/api-error";
import { CreateProjectMemberDto, createProjectMemberSchema } from "@/lib/schemas/project-member.schema";
import { WorkspaceMemberWithUserResponseDto } from "@/lib/dtos/workspace-members.dto";
import { assignableProjectRoles } from "@/lib/permissions/project-member-permissions";
import { getInitials } from "@/lib/utils";

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
  const createProjectMember = useCreateProjectMember(workspaceSlug, projectSlug);
  const { data: me } = useQuery(getMeQuery());
  const { data: projectMembers } = useQuery(getProjectMembersQuery({ workspaceSlug, projectSlug }));
  const { data: workspaceMembers, isLoading: isCandidatesLoading } = useQuery(
    getActiveWorkspaceMembersQuery(workspaceSlug, projectSlug),
  );

  const myRole = projectMembers?.data.find((member) => member.userId === me?.id)?.role;
  const assignableRoles = assignableProjectRoles(myRole);

  const candidates = workspaceMembers?.data ?? [];

  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<WorkspaceMemberWithUserResponseDto | null>(null);

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
      setSelectedMember(null);
    }
    onOpenChange(next);
  }

  const query = search.toLowerCase();
  const results = query
    ? candidates.filter(
        (member) =>
          member.user.name.toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query),
      )
    : candidates;

  function handleSelectMember(member: WorkspaceMemberWithUserResponseDto) {
    setSelectedMember(member);
    form.setValue("userId", member.userId, { shouldValidate: true });
  }

  function handleClearMember() {
    setSelectedMember(null);
    form.setValue("userId", "", { shouldValidate: true });
  }

  async function onSubmit(data: CreateProjectMemberDto) {
    try {
      const addedName = selectedMember?.user.name;
      await createProjectMember.mutateAsync(data);
      handleOpenChange(false);
      toast.add({
        type: "success",
        description: `${addedName} added to the project.`,
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
      description="Add a workspace member to this project."
      formId="add-project-member-form"
      submitLabel="Add member"
      pending={createProjectMember.isPending}
    >
      <form id="add-project-member-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-member-search">Member</FieldLabel>
            {selectedMember ? (
              <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
                <Avatar size="sm">
                  <AvatarImage src={selectedMember.user.avatarUrl ?? undefined} alt={selectedMember.user.name} />
                  <AvatarFallback>{getInitials(selectedMember.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col truncate text-sm">
                  <span className="truncate">{selectedMember.user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{selectedMember.user.email}</span>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={handleClearMember}>
                  <XIcon />
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="project-member-search"
                    type="text"
                    placeholder="Search by name or email"
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
                  {isCandidatesLoading ? (
                    <>
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </>
                  ) : results.length === 0 ? (
                    <p className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
                      <UserIcon className="size-4" />
                      No matching workspace members found.
                    </p>
                  ) : (
                    results.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectMember(member)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                      >
                        <Avatar size="sm">
                          <AvatarImage src={member.user.avatarUrl ?? undefined} alt={member.user.name} />
                          <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col truncate">
                          <span className="truncate">{member.user.name}</span>
                          <span className="truncate text-xs text-muted-foreground">{member.user.email}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
            {form.formState.errors.userId && <FieldError errors={[{ message: "Select a person to add" }]} />}
          </Field>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="project-member-role">Role</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="project-member-role" className="w-full">
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
