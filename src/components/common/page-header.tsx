import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-xl font-semibold">{title}</h1>
      {actions}
    </div>
  );
}
