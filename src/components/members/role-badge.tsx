import { Badge } from "@/components/ui/badge";
import {
  MemberRole,
  RoleFilter,
  roleDescription,
  roleFilterIcon,
  roleFilterLabels,
  roleIcon,
  roleLabel,
  roleVariant,
} from "@/lib/role-labels";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";

export function RoleBadge({ role }: { role: MemberRole }) {
  const Icon = roleIcon[role];

  return (
    <Badge variant={roleVariant[role]}>
      <Icon />
      {roleLabel[role]}
    </Badge>
  );
}

export function RoleIconLabel({ role }: { role: RoleFilter }) {
  const Icon = roleFilterIcon[role];

  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-4" />
      {roleFilterLabels[role]}
    </span>
  );
}

export function RoleSelectItemContent({ role }: { role: MemberRole }) {
  const Icon = roleIcon[role];
  return (
    <Item size="xs" className="w-full text-wrap">
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{roleLabel[role]}</ItemTitle>
        <ItemDescription>{roleDescription[role]}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
