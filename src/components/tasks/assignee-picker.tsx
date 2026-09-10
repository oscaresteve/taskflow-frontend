"use client";

import { useId, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MemberCandidate, MemberPicker, toMemberCandidate } from "@/components/members/member-picker";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getActiveProjectMembersInfiniteQuery, getProjectMemberQuery } from "@/lib/queries/project-member.queries";
import { cn, getInitials } from "@/lib/utils";

const PICKER_PAGE_SIZE = 10;

interface AssigneePickerProps {
  workspaceSlug: string;
  projectSlug: string;
  value: string | null;
  onChange: (userId: string | null) => void;
  variant?: "avatar" | "avatar-name";
  id?: string;
  className?: string;
}

export function AssigneePicker({
  workspaceSlug,
  projectSlug,
  value,
  onChange,
  variant = "avatar-name",
  id,
  className,
}: AssigneePickerProps) {
  const t = useTranslations("tasks");
  const pickerId = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const { data: selectedMember } = useQuery(getProjectMemberQuery({ workspaceSlug, projectSlug, userId: value }));

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...getActiveProjectMembersInfiniteQuery({ workspaceSlug, projectSlug, search: debouncedSearch, limit: PICKER_PAGE_SIZE }),
    enabled: open,
  });

  const candidates = (data?.pages.flatMap((page) => page.data) ?? []).map(toMemberCandidate);
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - candidates.length : 0;

  const selected = selectedMember ? toMemberCandidate(selectedMember) : null;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setSearch("");
  }

  function handleSelect(candidate: MemberCandidate) {
    onChange(candidate.userId);
    setOpen(false);
    setSearch("");
  }

  function handleClear() {
    onChange(null);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {variant === "avatar" ? (
        <PopoverTrigger
          id={id}
          nativeButton={false}
          render={<Avatar size="sm" className={cn("cursor-pointer transition-opacity hover:opacity-80", className)} />}
        >
          <AvatarImage src={selected?.avatarUrl ?? undefined} alt={selected?.name} />
          <AvatarFallback>{selected ? getInitials(selected.name) : <UserIcon className="size-3.5" />}</AvatarFallback>
        </PopoverTrigger>
      ) : (
        <PopoverTrigger
          id={id}
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm hover:bg-accent",
            className
          )}
        >
          <Avatar size="sm">
            <AvatarImage src={selected?.avatarUrl ?? undefined} alt={selected?.name} />
            <AvatarFallback>
              {selected ? getInitials(selected.name) : <UserIcon className="size-3.5" />}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate text-left">{selected?.name ?? t("fields.unassigned")}</span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </PopoverTrigger>
      )}
      <PopoverContent align="start">
        <MemberPicker
          id={pickerId}
          label={t("fields.assignee")}
          search={search}
          onSearchChange={setSearch}
          candidates={candidates}
          isLoading={isLoading}
          emptyMessage={t("assigneePicker.emptyMessage")}
          selected={selected}
          onSelect={handleSelect}
          onClear={handleClear}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          remaining={remaining}
          onLoadMore={() => fetchNextPage()}
        />
      </PopoverContent>
    </Popover>
  );
}
