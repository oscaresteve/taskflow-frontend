import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WorkspaceNotFound() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-semibold">Workspace not found</h1>
        <p className="text-sm text-muted-foreground">This workspace doesn&apos;t exist or you don&apos;t have access to it.</p>
      </div>
      <Button nativeButton={false} render={<Link href="/home" />}>
        Go to home
      </Button>
    </main>
  );
}
