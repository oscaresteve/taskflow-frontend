"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ICONS } from "@/lib/icons";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getActiveProjectMembersInfiniteQuery, getProjectMemberQuery } from "@/lib/queries/project-member.queries";
import { cn, getFullName, getInitials } from "@/lib/utils";

const PICKER_PAGE_SIZE = 10;
const ITEM_CLASSNAME = "gap-1.5 py-1 pl-2";

interface AssigneeCandidate {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

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
  const anchor = useComboboxAnchor();
  const [open, setOpen] = useState(false);

  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const { data: selectedMember } = useQuery(getProjectMemberQuery({ workspaceSlug, projectSlug, userId: value }));

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

  const selected: AssigneeCandidate | null = selectedMember
    ? {
        userId: selectedMember.userId,
        name: getFullName(selectedMember.user.firstName, selectedMember.user.lastName),
        email: selectedMember.user.email,
        avatarUrl: selectedMember.user.avatarUrl,
      }
    : null;

  const label = selected ? selected.name : t("fields.unassigned");
  const inputValue = open ? editText : label;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    setSearch("");
    setEditText(next ? label : "");
  }

  function handleValueChange(
    candidate: AssigneeCandidate | null,
    eventDetails: ComboboxPrimitive.Root.ChangeEventDetails,
  ) {
    // Base UI also fires this for typing the input down to empty (`input-clear`) or pressing
    // Escape, which would otherwise commit "unassigned" mid-search. Only explicit selections
    // (clicking/Enter-ing an item, or the clear button) should update the assignee.
    if (eventDetails.reason !== "item-press" && eventDetails.reason !== "clear-press") {
      eventDetails.cancel();
      return;
    }
    onChange(candidate?.userId ?? null);
    setOpen(false);
    setSearch("");
    setEditText("");

    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  function handleInputValueChange(nextValue: string, eventDetails: ComboboxPrimitive.Root.ChangeEventDetails) {
    setEditText(nextValue);
    if (eventDetails.reason === "input-change") setSearch(nextValue);
  }

  const candidateList = (
    <ComboboxList>
      <ComboboxItem value={null} className={ITEM_CLASSNAME}>
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
        <p className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
          <ICONS.person className="size-4" />
          {t("assigneeSelect.emptyMessage")}
        </p>
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
  );

  return (
    <Combobox
      open={open}
      onOpenChange={handleOpenChange}
      inputValue={inputValue}
      onInputValueChange={handleInputValueChange}
      value={selected}
      onValueChange={handleValueChange}
      isItemEqualToValue={(item: AssigneeCandidate | null, val: AssigneeCandidate | null) =>
        item === null || val === null ? item === val : item.userId === val.userId
      }
      itemToStringLabel={(item: AssigneeCandidate | null) => item?.name ?? t("fields.unassigned")}
    >
      {variant === "avatar" ? (
        <>
          <ComboboxPrimitive.Trigger
            id={id}
            nativeButton={false}
            aria-label={label}
            render={<Avatar size="sm" className={cn("cursor-pointer outline-offset-1 hover:outline-2", className)} />}
          >
            <AvatarImage src={selected?.avatarUrl ?? undefined} alt={selected?.name} />
            {selected ? (
              <AvatarFallback>{getInitials(selected.name)}</AvatarFallback>
            ) : (
              <AvatarFallback>
                <ICONS.person className="size-4" />
              </AvatarFallback>
            )}
          </ComboboxPrimitive.Trigger>
          <ComboboxContent align="start" className="w-min">
            <div className="p-1 pb-2">
              <ComboboxInput
                placeholder={t("assigneeSelect.searchPlaceholder")}
                showTrigger={false}
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
              />
            </div>
            {candidateList}
          </ComboboxContent>
        </>
      ) : (
        <>
          <div ref={anchor}>
            <InputGroup className={className}>
              <InputGroupAddon>
                <Avatar size="sm">
                  <AvatarImage src={selected?.avatarUrl ?? undefined} alt={selected?.name} />
                  {selected ? (
                    <AvatarFallback>{getInitials(selected.name)}</AvatarFallback>
                  ) : (
                    <AvatarFallback>
                      <ICONS.person className="size-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </InputGroupAddon>
              <ComboboxPrimitive.Input id={id} render={<InputGroupInput />} onFocus={(e) => e.currentTarget.select()} />
            </InputGroup>
          </div>
          <ComboboxContent anchor={anchor}>{candidateList}</ComboboxContent>
        </>
      )}
    </Combobox>
  );
}
