import { ReactNode } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingCardProps {
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  footerHint?: ReactNode;
  className?: string;
}

export function SettingCard({ title, description, action, children, footer, footerHint, className }: SettingCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
      {footer && (
        <CardFooter className="justify-between">
          <span className="text-sm text-muted-foreground">{footerHint}</span>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
