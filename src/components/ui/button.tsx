import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--raspberry)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[var(--ink)] text-[var(--cream)] hover:bg-[var(--raspberry)]",
        accent: "bg-[var(--raspberry)] text-white hover:bg-[var(--ink)]",
        outline: "border border-[color:var(--line)] bg-transparent text-[var(--ink)] hover:border-[var(--ink)] hover:bg-white/40",
        ghost: "text-[var(--ink)] hover:bg-black/5",
      },
      size: {
        default: "h-12 rounded-full px-6",
        sm: "h-9 rounded-full px-4",
        lg: "h-14 rounded-full px-8 text-base",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"
