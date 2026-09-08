"use client";

import { useState } from "react";
import { Palette, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColorDot } from "@/components/ui/color-dot";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { COLORS } from "@/lib/colors";

interface ColorPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const colorButtonClassName =
  "flex size-9 outline-2 outline-offset-2 outline-transparent transition-[outline-color,transform] hover:scale-105 cursor-pointer border";

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  function handleSelect(color: string | null) {
    onChange(color);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        nativeButton={false}
        render={<Avatar size="lg" className="cursor-pointer transition-opacity hover:opacity-80" />}
      >
        <AvatarFallback style={value ? { backgroundColor: value } : undefined}>
          {!value && <Palette className="size-4 text-muted-foreground" />}
        </AvatarFallback>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-fit" align="end">
        <div className="grid grid-cols-4 gap-x-3 gap-y-2">
          <button type="button" aria-label="No color" aria-pressed={value === null} onClick={() => handleSelect(null)}>
            <ColorDot className={cn(colorButtonClassName, value === null && "outline-ring")}>
              <XIcon className="size-4" />
            </ColorDot>
          </button>
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={value === color}
              onClick={() => handleSelect(color)}
            >
              <ColorDot color={color} className={cn(colorButtonClassName, value === color && "outline-ring")} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
