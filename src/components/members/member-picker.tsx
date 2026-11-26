"use client";

import { ICONS } from "@/lib/icons";

import { CustomAvatar } from "@/components/common/custom-avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/search-input";
import { EmptyInline } from "@/components/common/empty-inline";
import { getFullName } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface MemberCandidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface MemberWithUser {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export function toMemberCandidate(member: MemberWithUser): MemberCandidate {
  return {
    id: member.id,
    userId: member.userId,
    name: getFullName(member.user.firstName, member.user.lastName),
    email: member.user.email,
    avatarUrl: member.user.avatarUrl,
  };
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
  label,
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
  const t = useTranslations("members");

  return (
    <Field>
      <FieldLabel htmlFor={`${id}-search`}>{label ?? t("memberPicker.defaultLabel")}</FieldLabel>
      {selected ? (
        <div className="flex items-center gap-2 rounded-lg border border-input px-2.5 py-1.5">
          <CustomAvatar
            size="sm"
            avatarUrl={selected.avatarUrl}
            alt={selected.name}
            seed={selected.userId}
            variant="glyphs"
          />
          <div className="flex flex-1 flex-col truncate text-sm">
            <span className="truncate">{selected.name}</span>
            <span className="truncate text-xs text-muted-foreground">{selected.email}</span>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClear} aria-label={t("memberPicker.clearSelection")}>
            <ICONS.removeChip />
          </Button>
        </div>
      ) : (
        <>
          <SearchInput
            id={`${id}-search`}
            value={search}
            onChange={onSearchChange}
            placeholder={t("memberPicker.searchPlaceholder")}
            autoFocus
          />
          <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </>
            ) : candidates.length === 0 ? (
              <EmptyInline icon={ICONS.person} label={emptyMessage} className="px-1 py-2" />
            ) : (
              <>
                {candidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => onSelect(candidate)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    <CustomAvatar
                      size="sm"
                      avatarUrl={candidate.avatarUrl}
                      alt={candidate.name}
                      seed={candidate.userId}
                      variant="glyphs"
                    />
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
                    {isLoadingMore ? t("memberPicker.loadingMore") : t("memberPicker.moreCandidates", { count: remaining ?? 0 })}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
      {error && <FieldError errors={[{ message: t("memberPicker.selectPersonError") }]} />}
    </Field>
  );
}
