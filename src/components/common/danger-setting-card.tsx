import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingCard } from "@/components/common/setting-card";

interface DangerSettingCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  pending?: boolean;
}

export function DangerSettingCard({ Icon, title, description, actionLabel, onAction, pending = false }: DangerSettingCardProps) {
  return (
    <SettingCard
      className="ring-destructive/30"
      title={
        <span className="flex items-center gap-2 text-destructive">
          <Icon className="size-4" />
          {title}
        </span>
      }
      description={description}
      footer={
        <Button variant="destructive" onClick={onAction} disabled={pending}>
          {actionLabel}
        </Button>
      }
    />
  );
}
