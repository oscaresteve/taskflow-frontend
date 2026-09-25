import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: Icon;
  label: string;
  value: string | number;
  /** Color del icono: la clase se aplica tal cual (p.ej. rojo en vencidas, verde en completadas). */
  className?: string;
  /** Vista a la que baja el contador. Sin href la tarjeta no es enlace. */
  href?: string;
}

export function StatCard({ icon: Icon, label, value, className, href }: StatCardProps) {
  const card = (
    <Card size="sm" className={cn("h-full justify-center", href && "transition-colors hover:bg-muted/50")}>
      <CardContent className="flex gap-3 items-center">
        <div className="p-2 bg-muted rounded-md">
          <Icon className={cn("size-5 text-muted-foreground", className)} />
        </div>
        <span className="leading-tight text-muted-foreground line-clamp-2 min-w-0">{label}</span>
        <span className="text-2xl font-mono font-semibold ml-auto">{value}</span>
      </CardContent>
    </Card>
  );

  if (!href) return card;

  return <Link href={href}>{card}</Link>;
}

export function StatCardSkeleton() {
  return (
    <Card size="sm" className="justify-center">
      <CardContent className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="ml-auto h-7 w-10" />
      </CardContent>
    </Card>
  );
}
