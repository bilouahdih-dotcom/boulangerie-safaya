import { motion } from "motion/react"
import { ArrowDownRight } from "lucide-react"

export function AtelierInterlude() {
  return (
    <section className="atelier-interlude" aria-label="Le geste artisanal">
      <motion.figure
        className="atelier-visual"
        initial={{ y: 48, scale: 1.035, opacity: .72 }}
        whileInView={{ y: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: .25 }}
        transition={{ duration: 1.15, ease: [.16, 1, .3, 1] }}
      >
        <img src="/images/baker-hands.webp" alt="Mains d’un artisan boulanger travaillant une pâte farinée" width={1800} height={2239} loading="lazy" decoding="async" />
        <div className="atelier-visual-shade" />
      </motion.figure>

      <div className="atelier-copy">
        <motion.p className="atelier-line atelier-line-one" initial={{ x: -56, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .9, delay: .08, ease: [.16, 1, .3, 1] }}>Avant la ville,</motion.p>
        <motion.p className="atelier-line atelier-line-two" initial={{ x: 56, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .9, delay: .18, ease: [.16, 1, .3, 1] }}>il y a le geste.</motion.p>
      </div>

      <div className="atelier-meta">
        <span>03:45</span>
        <p>Le pétrissage commence.<br />Le quartier dort encore.</p>
      </div>
      <div className="atelier-cue"><ArrowDownRight /> Du vivant, jamais du décor</div>
    </section>
  )
}
