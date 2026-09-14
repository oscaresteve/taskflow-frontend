import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone?: "default" | "destructive";
}

export function StatCard({ icon: Icon, label, value, tone = "default" }: StatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <Icon className={cn("size-5 text-muted-foreground", tone === "destructive" && "text-destructive")} />
        <div className="grid gap-0.5">
          <span className={cn("text-lg font-semibold leading-none", tone === "destructive" && "text-destructive")}>
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
