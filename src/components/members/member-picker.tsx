"use client";

import { UserIcon, XIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/search-input";
import { getInitials } from "@/lib/utils";

export interface MemberCandidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface MemberPickerProps {
  id: string;
  label?: string;
  search: string;
  onSearchChange: (value: string) => void;
  candidates: MemberCandidate[];
  isLoading: boolean;
  emptyMessage: string;
  selected: MemberCandidate | null;
  onSelect: (candidate: MemberCandidate) => void;
  onClear: () => void;
  error?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  remaining?: number;
  onLoadMore?: () => void;
}

export function MemberPicker({
  id,
  label = "Member",
  search,
  onSearchChange,
  candidates,
  isLoading,
  emptyMessage,
  selected,
  onSelect,
  onClear,
  error,
  hasMore,
  isLoadingMore,
  remaining,
  onLoadMore,
}: MemberPickerProps) {
  return (
    <Field>
      <FieldLabel htmlFor={`${id}-search`}>{label}</FieldLabel>
      {selected ? (
        <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
          <Avatar size="sm">
            <AvatarImage src={selected.avatarUrl ?? undefined} alt={selected.name} />
            <AvatarFallback>{getInitials(selected.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col truncate text-sm">
            <span className="truncate">{selected.name}</span>
            <span className="truncate text-xs text-muted-foreground">{selected.email}</span>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClear}>
            <XIcon />
          </Button>
        </div>
      ) : (
        <>
          <SearchInput
            id={`${id}-search`}
            value={search}
            onChange={onSearchChange}
            placeholder="Search by name or email"
            autoFocus
          />
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </>
            ) : candidates.length === 0 ? (
              <p className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
                <UserIcon className="size-4" />
                {emptyMessage}
              </p>
            ) : (
              <>
                {candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => onSelect(candidate)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={candidate.avatarUrl ?? undefined} alt={candidate.name} />
                      <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col truncate">
                      <span className="truncate">{candidate.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{candidate.email}</span>
                    </div>
                  </button>
                ))}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => !isLoadingMore && onLoadMore?.()}
                    aria-disabled={isLoadingMore}
                    className="rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted"
                  >
                    {isLoadingMore ? "Loading…" : `${remaining} more`}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
      {error && <FieldError errors={[{ message: "Select a person to add" }]} />}
    </Field>
  );
}
