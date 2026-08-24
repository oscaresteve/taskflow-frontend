"use client";

import { useEffect, useState } from "react";
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
import { useCreateWorkspaceMember } from "@/hooks/use-create-workspace-member";
import { getUsersQuery } from "@/lib/queries/user.queries";
import { getWorkspaceMembersQuery } from "@/lib/queries/workspace-member.queries";
import { getMeQuery } from "@/lib/queries/auth.queries";
import { ApiError } from "@/lib/http/api-error";
import { CreateWorkspaceMemberDto, createWorkspaceMemberSchema } from "@/lib/schemas/workspace-member.schema";
import { UserResponseDto } from "@/lib/dtos/auth.dto";
import { getInitials } from "@/lib/utils";
import { assignableWorkspaceRoles } from "@/lib/permissions/workspace-member-permissions";

interface AddMemberDialogProps {
  workspaceSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialog({ workspaceSlug, open, onOpenChange }: AddMemberDialogProps) {
  const createWorkspaceMember = useCreateWorkspaceMember(workspaceSlug);
  const { data: me } = useQuery(getMeQuery());
  const { data: workspaceMembers } = useQuery(getWorkspaceMembersQuery(workspaceSlug));
  const myRole = workspaceMembers?.data.find((member) => member.userId === me?.id)?.role;
  const assignableRoles = assignableWorkspaceRoles(myRole);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);

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
      setSelectedUser(null);
    }
    onOpenChange(next);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: users, isLoading: isUsersLoading } = useQuery(getUsersQuery(debouncedSearch, workspaceSlug));
  const results = users?.data ?? [];

  function handleSelectUser(user: UserResponseDto) {
    setSelectedUser(user);
    form.setValue("userId", user.id, { shouldValidate: true });
  }

  function handleClearUser() {
    setSelectedUser(null);
    form.setValue("userId", "", { shouldValidate: true });
  }

  async function onSubmit(data: CreateWorkspaceMemberDto) {
    try {
      const addedName = selectedUser?.name;
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
          <Field>
            <FieldLabel htmlFor="member-search">Member</FieldLabel>
            {selectedUser ? (
              <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
                <Avatar size="sm">
                  <AvatarImage src={selectedUser.avatarUrl ?? undefined} alt={selectedUser.name} />
                  <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col truncate text-sm">
                  <span className="truncate">{selectedUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{selectedUser.email}</span>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={handleClearUser}>
                  <XIcon />
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="member-search"
                    type="text"
                    placeholder="Search by name or email"
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
                  {isUsersLoading ? (
                    <>
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-9 w-full" />
                    </>
                  ) : results.length === 0 ? (
                    <p className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
                      <UserIcon className="size-4" />
                      No matching people found.
                    </p>
                  ) : (
                    results.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                      >
                        <Avatar size="sm">
                          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col truncate">
                          <span className="truncate">{user.name}</span>
                          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
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
