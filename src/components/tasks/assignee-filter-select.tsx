"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ICONS } from "@/lib/icons";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyInline } from "@/components/common/empty-inline";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getActiveProjectMembersInfiniteQuery, getProjectMemberQuery } from "@/lib/queries/project-member.queries";
import { ALL_ASSIGNEES, UNASSIGNED } from "@/lib/task-enums";
import { cn, getFullName, getInitials } from "@/lib/utils";

const PICKER_PAGE_SIZE = 10;
const ITEM_CLASSNAME = "gap-1.5 py-1 pl-2";

interface AssigneeCandidate {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

type AssigneeFilterItem = AssigneeCandidate | typeof ALL_ASSIGNEES | typeof UNASSIGNED;

interface AssigneeFilterSelectProps {
  workspaceSlug: string;
  projectSlug: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AssigneeFilterSelect({
  workspaceSlug,
  projectSlug,
  value,
  onChange,
  className,
}: AssigneeFilterSelectProps) {
  const t = useTranslations("tasks");
  const [open, setOpen] = useState(false);

  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const selectedUserId = value !== ALL_ASSIGNEES && value !== UNASSIGNED ? value : null;
  const { data: selectedMember } = useQuery(
    getProjectMemberQuery({ workspaceSlug, projectSlug, userId: selectedUserId }),
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...getActiveProjectMembersInfiniteQuery({
      workspaceSlug,
      projectSlug,
      search: debouncedSearch,
      limit: PICKER_PAGE_SIZE,
    }),
    enabled: open,
  });

  const candidates: AssigneeCandidate[] = (data?.pages.flatMap((page) => page.data) ?? []).map((member) => ({
    userId: member.userId,
    name: getFullName(member.user.firstName, member.user.lastName),
    email: member.user.email,
    avatarUrl: member.user.avatarUrl,
  }));
  const remaining = data ? data.pages[data.pages.length - 1].pagination.total - candidates.length : 0;

  const selectedCandidate: AssigneeCandidate | null = selectedMember
    ? {
        userId: selectedMember.userId,
        name: getFullName(selectedMember.user.firstName, selectedMember.user.lastName),
        email: selectedMember.user.email,
        avatarUrl: selectedMember.user.avatarUrl,
      }
    : null;

  const selected: AssigneeFilterItem =
    value === ALL_ASSIGNEES ? ALL_ASSIGNEES : value === UNASSIGNED ? UNASSIGNED : (selectedCandidate ?? ALL_ASSIGNEES);

  function labelFor(item: AssigneeFilterItem) {
    if (item === ALL_ASSIGNEES) return t("assigneeFilter.all");
    if (item === UNASSIGNED) return t("fields.unassigned");
    return item.name;
  }

  const label = labelFor(selected);
  const inputValue = open ? editText : label;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    setSearch("");
    setEditText(next ? label : "");
  }

  function handleValueChange(item: AssigneeFilterItem | null, eventDetails: ComboboxPrimitive.Root.ChangeEventDetails) {
    // Same reasoning as AssigneePicker: only commit on an explicit item selection, not on typing
    // down to empty or pressing Escape.
    if (eventDetails.reason !== "item-press" || item === null) {
      eventDetails.cancel();
      return;
    }
    onChange(item === ALL_ASSIGNEES ? ALL_ASSIGNEES : item === UNASSIGNED ? UNASSIGNED : item.userId);
    setOpen(false);
    setSearch("");
    setEditText("");

    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  function handleInputValueChange(nextValue: string, eventDetails: ComboboxPrimitive.Root.ChangeEventDetails) {
    setEditText(nextValue);
    if (eventDetails.reason === "input-change") setSearch(nextValue);
  }

  return (
    <Combobox
      open={open}
      onOpenChange={handleOpenChange}
      inputValue={inputValue}
      onInputValueChange={handleInputValueChange}
      value={selected}
      onValueChange={handleValueChange}
      isItemEqualToValue={(item: AssigneeFilterItem, val: AssigneeFilterItem) =>
        typeof item === "string" || typeof val === "string" ? item === val : item.userId === val.userId
      }
      itemToStringLabel={(item: AssigneeFilterItem) => labelFor(item)}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ComboboxPrimitive.Trigger
              nativeButton={false}
              aria-label={label}
              render={<Avatar size="sm" className={cn("cursor-pointer outline-offset-1 hover:outline-2", className)} />}
            />
          }
        >
          {typeof selected === "object" ? (
            <>
              <AvatarImage src={selected.avatarUrl ?? undefined} alt={selected.name} />
              <AvatarFallback>{getInitials(selected.name)}</AvatarFallback>
            </>
          ) : selected === UNASSIGNED ? (
            <AvatarFallback>
              <ICONS.person className="size-4" />
            </AvatarFallback>
          ) : (
            <AvatarFallback>
              <ICONS.members className="size-4" />
            </AvatarFallback>
          )}
        </TooltipTrigger>
        <TooltipContent>{`${t("fields.assignee")}: ${label}`}</TooltipContent>
      </Tooltip>
      <ComboboxContent align="start" className="w-min">
        <div className="p-1 pb-2">
          <ComboboxInput
            placeholder={t("assigneeSelect.searchPlaceholder")}
            showTrigger={false}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
          />
        </div>
        <ComboboxList className="min-w-max">
          <ComboboxItem value={ALL_ASSIGNEES} className={ITEM_CLASSNAME}>
            <Avatar size="sm">
              <AvatarFallback>
                <ICONS.members className="size-4" />
              </AvatarFallback>
            </Avatar>
            <span>{t("assigneeFilter.all")}</span>
          </ComboboxItem>
          <ComboboxItem value={UNASSIGNED} className={ITEM_CLASSNAME}>
            <Avatar size="sm">
              <AvatarFallback>
                <ICONS.person />
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{t("fields.unassigned")}</span>
          </ComboboxItem>
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </>
          ) : candidates.length === 0 ? (
            <EmptyInline icon={ICONS.person} label={t("assigneeSelect.emptyMessage")} className="px-2 py-3" />
          ) : (
            <>
              {candidates.map((candidate) => (
                <ComboboxItem key={candidate.userId} value={candidate} className={ITEM_CLASSNAME}>
                  <Avatar size="sm">
                    <AvatarImage src={candidate.avatarUrl ?? undefined} alt={candidate.name} />
                    <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col truncate">
                    <span className="truncate">{candidate.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{candidate.email}</span>
                  </div>
                </ComboboxItem>
              ))}
              {hasNextPage && (
                <button
                  type="button"
                  onClick={() => !isFetchingNextPage && fetchNextPage()}
                  aria-disabled={isFetchingNextPage}
                  className="rounded-md w-full px-2 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
                >
                  {isFetchingNextPage
                    ? t("assigneeSelect.loadingMore")
                    : t("assigneeSelect.moreCandidates", { count: remaining })}
                </button>
              )}
            </>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
