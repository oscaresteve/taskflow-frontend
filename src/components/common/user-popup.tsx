"use client";

import { ComponentProps } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { EnumBadge } from "@/components/common/enum-display";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserQuery } from "@/lib/queries/user.queries";
import { userActiveOption, userInactiveOption } from "@/lib/user-enums";
import { getFullName } from "@/lib/utils";

interface UserPopupProps {
  userId: string;
  align?: ComponentProps<typeof PopoverContent>["align"];
  render: ComponentProps<typeof PopoverTrigger>["render"];
}

export function UserPopup({ userId, align = "start", render }: UserPopupProps) {
  return (
    <span
      className="inline-flex"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Popover>
        <PopoverTrigger nativeButton={false} render={render} />
        <PopoverContent align={align} className="w-64">
          <UserPopupContent userId={userId} />
        </PopoverContent>
      </Popover>
    </span>
  );
}

function UserPopupContent({ userId }: { userId: string }) {
  const t = useTranslations("common.userPopup");
  const format = useFormatter();
  const { data: user } = useQuery(getUserQuery(userId));

  if (!user) {
    return <UserPopupSkeleton />;
  }

  const userName = getFullName(user.firstName, user.lastName);
  const now = new Date();

  return (
    <>
      <div className="flex items-center gap-2.5">
        <CustomAvatar
          className="size-10 shrink-0"
          avatarUrl={user.avatarUrl}
          alt={userName}
          seed={user.id}
          variant="glyphs"
        />
        <PopoverHeader className="min-w-0 flex-1">
          <PopoverTitle className="truncate">{userName}</PopoverTitle>
          <PopoverDescription className="truncate text-xs">{user.email}</PopoverDescription>
        </PopoverHeader>
      </div>

      <EnumBadge className="self-start" option={user.isActive ? userActiveOption : userInactiveOption} />

      <Separator />

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt className="text-muted-foreground">{t("joined")}</dt>
        <dd className="text-right">{format.relativeTime(new Date(user.createdAt), now)}</dd>
        <dt className="text-muted-foreground">{t("lastLogin")}</dt>
        <dd className="text-right">
          {user.lastLoginAt ? format.relativeTime(new Date(user.lastLoginAt), now) : t("neverLoggedIn")}
        </dd>
      </dl>
    </>
  );
}

function UserPopupSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
      <Separator />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </>
  );
}
