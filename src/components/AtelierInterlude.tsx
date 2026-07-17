import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowDownRight } from "lucide-react"

export function AtelierInterlude() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const copyX = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"])
  const accentX = useTransform(scrollYProgress, [0, 1], ["-10%", "8%"])

  return (
    <section className="atelier-interlude" ref={sectionRef} aria-label="Le geste artisanal">
      <motion.figure className="atelier-visual" style={{ y: imageY }}>
        <img src="/images/baker-hands.webp" alt="Mains d’un artisan boulanger travaillant une pâte farinée" width={1800} height={2239} loading="lazy" decoding="async" />
        <div className="atelier-visual-shade" />
      </motion.figure>

      <div className="atelier-copy">
        <motion.p className="atelier-line atelier-line-one" style={{ x: copyX }}>Avant la ville,</motion.p>
        <motion.p className="atelier-line atelier-line-two" style={{ x: accentX }}>il y a le geste.</motion.p>
      </div>

      <div className="atelier-meta">
        <span>03:45</span>
        <p>Le pétrissage commence.<br />Le quartier dort encore.</p>
      </div>
      <div className="atelier-cue"><ArrowDownRight /> Du vivant, jamais du décor</div>
    </section>
  )
}
