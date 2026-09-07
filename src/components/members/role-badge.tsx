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
  return (
    <span className="flex flex-col gap-1 py-1.5 whitespace-normal">
      <RoleIconLabel role={role} />
      <span className="text-xs font-normal text-muted-foreground">{roleDescription[role]}</span>
    </span>
  );
}
