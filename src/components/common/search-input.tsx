"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { cva } from "class-variance-authority";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SearchInputSize = "xs" | "sm" | "default" | "lg";

const searchInputVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 rounded-[min(var(--radius-md),10px)] pl-6 pr-5 text-xs",
      sm: "h-7 rounded-[min(var(--radius-md),12px)] pl-7 pr-6 text-[0.8rem]",
      default: "h-8 pl-8 pr-7",
      lg: "h-9 pl-8 pr-7",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const iconClasses: Record<SearchInputSize, string> = {
  xs: "left-2 size-3",
  sm: "left-2 size-3.5",
  default: "left-2.5 size-4",
  lg: "left-2.5 size-4",
};

const clearButtonClasses: Record<SearchInputSize, string> = {
  xs: "right-1.5",
  sm: "right-1.5",
  default: "right-2",
  lg: "right-2",
};

const clearIconClasses: Record<SearchInputSize, string> = {
  xs: "size-3",
  sm: "size-3",
  default: "size-3.5",
  lg: "size-3.5",
};

interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  size?: SearchInputSize;
}

export function SearchInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
  size = "default",
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          iconClasses[size],
        )}
      />
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        className={searchInputVariants({ size })}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            clearButtonClasses[size],
          )}
          onClick={() => onChange("")}
        >
          <XIcon className={clearIconClasses[size]} />
        </button>
      ) : null}
    </div>
  );
}
