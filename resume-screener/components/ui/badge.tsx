import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "secondary" | "outline"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "micro-label inline-flex items-center rounded-full px-2.5 py-0.5",
          {
            "bg-primary/10 text-primary border border-primary/20": variant === "default",
            "bg-success/10 text-success border border-success/20": variant === "success",
            "bg-warning/10 text-warning border border-warning/20": variant === "warning",
            "bg-destructive/10 text-destructive border border-destructive/20": variant === "destructive",
            "bg-secondary text-muted-foreground border border-border": variant === "secondary",
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
