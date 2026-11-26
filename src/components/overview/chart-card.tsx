import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  /** Sin descripcion la tarjeta se pinta cargando: es lo que pasa mientras no hay datos. */
  description?: string;
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, className, children }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description ?? <Skeleton className="h-4 w-40" />}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center">{children}</CardContent>
    </Card>
  );
}
