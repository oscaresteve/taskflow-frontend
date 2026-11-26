"use client";

import type { ComponentProps } from "react";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ActionsMenuContent({ className, ...props }: ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent className={cn("min-w-max px-0 py-1.5", className)} {...props} />;
}

export function ActionsMenuItem({ className, ...props }: ComponentProps<typeof DropdownMenuItem>) {
  return <DropdownMenuItem className={cn("px-3 rounded-none", className)} {...props} />;
}

export function ActionsMenuLabel({ className, ...props }: ComponentProps<typeof DropdownMenuLabel>) {
  return <DropdownMenuLabel className={cn("px-3", className)} {...props} />;
}
