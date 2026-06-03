import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "strong" | "possible" | "not-fit" | "outline"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "micro-label inline-flex items-center rounded-full px-2.5 py-0.5",
          {
            "bg-primary/20 text-primary border border-primary/30": variant === "default" || variant === "possible",
            "bg-accent/20 text-accent border border-accent/30": variant === "strong",
            "bg-destructive/20 text-destructive/90 border border-destructive/30": variant === "not-fit",
            "bg-transparent border border-border text-muted-foreground": variant === "outline",
          },
          className,
        )}
        {...props}
      />
    )
  },
)
Badge.displayName = "Badge"

export { Badge }
