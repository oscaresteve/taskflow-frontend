import { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingCardProps {
  title: ReactNode;
  description: ReactNode;
  /** Control con tamaño propio (avatar, color, select, segmentado): a la derecha del nombre. */
  action?: ReactNode;
  /** Campo de texto: debajo del nombre y a lo ancho de la tarjeta. */
  children?: ReactNode;
  footerAction?: ReactNode;
  footerHint?: ReactNode;
  className?: string;
}

export function SettingCard({
  title,
  description,
  action,
  children,
  footerAction,
  footerHint,
  className,
}: SettingCardProps) {
  return (
    <Card className={className}>
      {/* Dos sitios, segun lo que sea el control: un campo de texto quiere todo el ancho y va debajo
          del nombre; uno que ya trae su tamano (el avatar, el color, el idioma, el tema) va en la
          misma fila que el nombre, pegado a la derecha, en vez de estirarse sin motivo. */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {/* Sin el tinte del primitivo: el borde ya separa el pie, y el relleno sumaba una superficie
          dentro de una superficie. */}
      {(footerAction || footerHint) && (
        <CardFooter className="bg-transparent">
          {footerHint && <span className="text-sm text-muted-foreground">{footerHint}</span>}
          {footerAction && <div className="ml-auto">{footerAction}</div>}
        </CardFooter>
      )}
    </Card>
  );
}
