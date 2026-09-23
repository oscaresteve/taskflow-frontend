import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Style, Avatar as DicebearAvatar } from "@dicebear/core";
import glass from "@dicebear/styles/glass.json" with { type: "json" };
import glyphs from "@dicebear/styles/glyphs.json" with { type: "json" };

import { ComponentProps } from "react";

const styles = {
  glass: new Style(glass),
  glyphs: new Style(glyphs),
};

export type DicebearVariant = keyof typeof styles;

export function getDicebearDataUri(seed: string, variant: DicebearVariant = "glass") {
  return new DicebearAvatar(styles[variant], { seed, size: 128 }).toDataUri();
}

interface CustomAvatarProps extends Omit<ComponentProps<typeof Avatar>, "children"> {
  avatarUrl: string | null;
  alt?: string;
  seed: string;
  variant?: DicebearVariant;
}

export function CustomAvatar({
  avatarUrl,
  alt,
  seed,
  variant = "glass",
  size = "default",
  className,
  ...props
}: CustomAvatarProps) {
  return (
    <Avatar size={size} className={className} {...props}>
      <AvatarImage src={avatarUrl ?? getDicebearDataUri(seed, variant)} alt={alt} />
      <AvatarFallback>{alt ? getInitials(alt) : "?"}</AvatarFallback>
    </Avatar>
  );
}
