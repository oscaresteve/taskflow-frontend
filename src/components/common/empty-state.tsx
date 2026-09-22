import type { ReactNode } from "react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

// Convencion "empty state" para sitios con espacio real (pagina completa, panel grande): mismo
// Empty de shadcn en todos para que la estructura (icono/titulo/descripcion/cta) no se repita a
// mano en cada tabla. Para listas/dropdowns/popovers sin ese espacio, usar EmptyInline en su lugar.
interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: IconComponent, title, description, action, className }: EmptyStateProps) {
  return (
    <Empty className={cn(className, "border border-dashed")}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconComponent />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
