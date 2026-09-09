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
import { cn } from "@/lib/utils";

interface SettingCardProps {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  footerAction?: ReactNode;
  footerHint?: ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function SettingCard({
  title,
  description,
  action,
  children,
  footerAction,
  footerHint,
  className,
  orientation = "vertical",
}: SettingCardProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <Card className={className}>
      <div className={cn("flex flex-col gap-(--card-spacing)", isHorizontal && "flex-row items-start")}>
        <CardHeader className={cn(isHorizontal && "min-w-0 flex-1")}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
        {children && <CardContent className={cn(isHorizontal && "shrink-0")}>{children}</CardContent>}
      </div>
      {(footerAction || footerHint) && (
        <CardFooter>
          {footerHint && <span className="text-sm text-muted-foreground">{footerHint}</span>}
          {footerAction && <div className="ml-auto">{footerAction}</div>}
        </CardFooter>
      )}
    </Card>
  );
}
