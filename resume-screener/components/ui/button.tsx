import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          {
            "command-strip text-black hover:shadow-[0_0_30px_rgba(199,155,55,0.4)] hover:-translate-y-0.5": variant === "primary",
            "bg-transparent border border-border text-foreground hover:border-primary hover:text-primary hover:shadow-[0_0_16px_rgba(199,155,55,0.2)]": variant === "outline",
            "bg-secondary/60 backdrop-blur-sm text-foreground hover:bg-secondary": variant === "secondary",
            "bg-transparent text-foreground hover:bg-muted": variant === "ghost",
            "bg-destructive text-white hover:bg-destructive/90": variant === "destructive",
          },
          {
            "px-4 py-1.5 text-xs": size === "sm",
            "px-6 py-2.5 text-sm": size === "md",
            "px-8 py-3.5 text-base": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
