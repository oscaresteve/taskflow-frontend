"use client";

import { AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar";
import { CustomAvatar } from "@/components/common/custom-avatar";
import { UserPopup } from "@/components/common/user-popup";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserSummaryResponseDto } from "@/lib/dtos/users.dto";
import { getFullName } from "@/lib/utils";

const MAX_VISIBLE_OWNERS = 4;

// Las caras de los responsables de una fila, en los listados de gestion de espacios y de proyectos.
// Los recibe ya resueltos a proposito: vienen en la propia fila del listado, porque preguntarlos por
// fila no funcionaria sobre un espacio desactivado ni un proyecto archivado (ahi el listado de
// miembros responde 404, justo en la pestana donde hay que decidir si recuperarlo).
export function OwnersCell({ owners }: { owners: UserSummaryResponseDto[] }) {
  if (owners.length === 0) return <span className="text-sm text-muted-foreground">—</span>;

  const visibleOwners = owners.slice(0, MAX_VISIBLE_OWNERS);
  const remainingOwners = owners.length - visibleOwners.length;

  return (
    <AvatarGroup>
      {visibleOwners.map((owner) => {
        const ownerName = getFullName(owner.firstName, owner.lastName);
        return (
          <Tooltip key={owner.id}>
            <UserPopup
              userId={owner.id}
              render={
                <TooltipTrigger
                  render={
                    <CustomAvatar
                      size="sm"
                      avatarUrl={owner.avatarUrl}
                      alt={ownerName}
                      seed={owner.id}
                      variant="glyphs"
                      className="cursor-pointer ring-2 ring-background"
                    />
                  }
                />
              }
            />
            <TooltipContent>{ownerName}</TooltipContent>
          </Tooltip>
        );
      })}
      {remainingOwners > 0 && <AvatarGroupCount>+{remainingOwners}</AvatarGroupCount>}
    </AvatarGroup>
  );
}
