import { useState } from "react"
import { motion } from "motion/react"

const navItems = [
  { href: "#maison", label: "La maison" },
  { href: "#savoir-faire", label: "Savoir-faire" },
  { href: "#avis", label: "Le quartier" },
] as const

export function AnimatedNav() {
  const [highlighted, setHighlighted] = useState<string | null>(null)

  return (
    <nav className="nav-v2" aria-label="Navigation principale" onMouseLeave={() => setHighlighted(null)}>
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onMouseEnter={() => setHighlighted(item.href)}
          onFocus={() => setHighlighted(item.href)}
          onBlur={() => setHighlighted(null)}
        >
          {highlighted === item.href && (
            <motion.span
              className="nav-highlight"
              layoutId="nav-highlight"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="nav-label">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
