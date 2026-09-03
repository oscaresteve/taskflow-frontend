import { cn } from "@/lib/utils"

function ColorDot({
  className,
  color,
  style,
  ...props
}: Omit<React.ComponentProps<"span">, "color"> & { color?: string | null }) {
  return (
    <span
      data-slot="color-dot"
      className={cn("size-2 shrink-0 rounded-full bg-muted-foreground", className)}
      style={color ? { backgroundColor: color, ...style } : style}
      {...props}
    />
  )
}

export { ColorDot }
