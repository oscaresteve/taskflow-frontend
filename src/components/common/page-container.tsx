import { cn } from "@/lib/utils";

export function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full p-6 gap-4 flex flex-col", className)} {...props} />;
}
