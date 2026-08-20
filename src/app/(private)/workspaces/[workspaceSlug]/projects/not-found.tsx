"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  const pathname = usePathname();
  const workspaceSlug = pathname.split("/")[2];

  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-xl font-semibold">Project not found</h1>
        <p className="text-sm text-muted-foreground">
          This project doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href={`/workspaces/${workspaceSlug}`} />}>
        Go to workspace
      </Button>
    </main>
  );
}
