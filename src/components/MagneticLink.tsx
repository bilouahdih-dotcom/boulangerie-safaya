import type { PointerEvent } from "react"
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react"

type MagneticLinkProps = HTMLMotionProps<"a">

export function MagneticLink({ children, onPointerMove, onPointerLeave, style, ...props }: MagneticLinkProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 })

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.14)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18)
    onPointerMove?.(event)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    x.set(0)
    y.set(0)
    onPointerLeave?.(event)
  }

  return (
    <motion.a
      {...props}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ ...style, x: springX, y: springY }}
    >
      {children}
    </motion.a>
  )
}
